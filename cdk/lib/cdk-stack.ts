import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class CdkStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);

    // === 1. NETWORKING ===
    // For testing, create a VPC instead of looking up (which requires real AWS context)
    let vpc: ec2.IVpc;
    
    if (this.node.tryGetContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup') !== undefined || !props?.env?.account) {
      // In test mode or when no account specified, create a VPC
      vpc = new ec2.Vpc(this, 'TestVPC', { maxAzs: 2 });
    } else {
      // In real deployment, look up default VPC
      vpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
    }
    
    // === 2. AURORA SERVERLESS DATABASE ===
    const dbCredentialsSecret = new secretsmanager.Secret(this, 'DBCredentialsSecret', {
      secretName: 'AllenAIUserDBCredentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'allenaiuser' }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\',
      },
    });

    const dbCluster = new rds.ServerlessCluster(this, 'AllenAICluster', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_13_13
      }),
      vpc,
      credentials: rds.Credentials.fromSecret(dbCredentialsSecret),
      defaultDatabaseName: 'AllenAIDB',
      scaling: {
        autoPause: cdk.Duration.minutes(10),
        minCapacity: rds.AuroraCapacityUnit.ACU_2,
        maxCapacity: rds.AuroraCapacityUnit.ACU_8
      },
      enableDataApi: true, // Needed for Lambda or Bedrock style integrations
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    
    // === 3. ECR REPOSITORIES ===
    const frontendRepo = ecr.Repository.fromRepositoryName(this, 'FrontendRepo', 'chatbot-frontend');
    const backendRepo = ecr.Repository.fromRepositoryName(this, 'BackendRepo', 'chatbot-backend');

    // === 4. ECS CLUSTER ===
    const cluster = new ecs.Cluster(this, 'ChatbotCluster', {
      vpc,
      clusterName: 'chatbot-cluster'
    });

    // === 5. TASK EXECUTION ROLE ===
    const taskExecutionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });

    // === 6. TASK ROLE (for AWS SDK calls) ===
    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      inlinePolicies: {
        DynamoDBPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:Query',
                'dynamodb:Scan',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem'
              ],
              resources: ['*'] // Restrict to specific tables in production
            })
          ]
        }),
        LambdaPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'lambda:InvokeFunction'
              ],
              resources: ['*'] // Restrict to specific functions in production
            })
          ]
        }),
        RDSDataAPIPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'rds-data:ExecuteStatement',
                'rds-data:BatchExecuteStatement',
                'rds-data:BeginTransaction',
                'rds-data:CommitTransaction',
                'rds-data:RollbackTransaction'
              ],
              resources: [dbCluster.clusterArn]
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'secretsmanager:GetSecretValue',
                'secretsmanager:DescribeSecret'
              ],
              resources: [dbCredentialsSecret.secretArn]
            })
          ]
        })
      }
    });

    // === 7. LOG GROUPS ===
    const frontendLogGroup = new logs.LogGroup(this, 'FrontendLogGroup', {
      logGroupName: '/ecs/chatbot-frontend',
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const backendLogGroup = new logs.LogGroup(this, 'BackendLogGroup', {
      logGroupName: '/ecs/chatbot-backend',
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // === 8. TASK DEFINITION ===
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'ChatbotTaskDefinition', {
      memoryLimitMiB: 2048,
      cpu: 1024,
      executionRole: taskExecutionRole,
      taskRole: taskRole
    });

    // === 9. FRONTEND CONTAINER ===
    const frontendContainer = taskDefinition.addContainer('FrontendContainer', {
      image: ecs.ContainerImage.fromEcrRepository(frontendRepo, 'latest'),
      memoryLimitMiB: 512,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'frontend',
        logGroup: frontendLogGroup
      }),
      environment: {
        BACKEND_URL: 'http://localhost:8080', // Backend runs on same task
        NODE_ENV: 'production'
      }
    });

    frontendContainer.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP
    });

    // === 10. BACKEND CONTAINER ===
    const backendContainer = taskDefinition.addContainer('BackendContainer', {
      image: ecs.ContainerImage.fromEcrRepository(backendRepo, 'latest'),
      memoryLimitMiB: 1536,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'backend',
        logGroup: backendLogGroup
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '8080',
        DB_CLUSTER_ARN: dbCluster.clusterArn,
        DB_SECRET_ARN: dbCredentialsSecret.secretArn,
        DB_NAME: 'AllenAIDB'
      }
    });

    backendContainer.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP
    });

    // === 11. ECS SERVICE ===
    const service = new ecs.FargateService(this, 'ChatbotService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true, // Required for pulling images from ECR
      serviceName: 'chatbot-service'
    });

    // === 12. APPLICATION LOAD BALANCER ===
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ChatbotALB', {
      vpc,
      internetFacing: true,
      loadBalancerName: 'chatbot-alb'
    });

    // === 13. TARGET GROUPS ===
    // Frontend target group
    const frontendTargetGroup = new elbv2.ApplicationTargetGroup(this, 'FrontendTargetGroup', {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      vpc,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: '/',
        healthyHttpCodes: '200'
      }
    });

    // Backend target group  
    const backendTargetGroup = new elbv2.ApplicationTargetGroup(this, 'BackendTargetGroup', {
      port: 8080,
      protocol: elbv2.ApplicationProtocol.HTTP,
      vpc,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: '/health',
        healthyHttpCodes: '200'
      }
    });

    // Register ECS service with target groups
    service.attachToApplicationTargetGroup(frontendTargetGroup);
    service.attachToApplicationTargetGroup(backendTargetGroup);

    // === 14. ALB LISTENERS ===
    const listener = alb.addListener('Listener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP
    });

    // Default action: serve frontend
    listener.addAction('DefaultAction', {
      action: elbv2.ListenerAction.forward([frontendTargetGroup])
    });

    // API routes: forward to backend
    listener.addAction('APIAction', {
      conditions: [
        elbv2.ListenerCondition.pathPatterns(['/api/*'])
      ],
      priority: 1,
      action: elbv2.ListenerAction.forward([backendTargetGroup])
    });

    // === 15. WAF WEB ACL ===
    const webAcl = new wafv2.CfnWebACL(this, 'ChatbotWebACL', {
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      description: 'WAF for Chatbot ALB',
      name: 'chatbot-web-acl',
      rules: [
        {
          name: 'AWSManagedRulesCommonRuleSet',
          priority: 1,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet'
            }
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'CommonRuleSetMetric'
          }
        },
        {
          name: 'AWSManagedRulesKnownBadInputsRuleSet',
          priority: 2,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesKnownBadInputsRuleSet'
            }
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'KnownBadInputsRuleSetMetric'
          }
        },
        {
          name: 'RateLimitRule',
          priority: 3,
          action: { block: {} },
          statement: {
            rateBasedStatement: {
              limit: 2000,
              aggregateKeyType: 'IP'
            }
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'RateLimitRuleMetric'
          }
        }
      ],
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'ChatbotWebACL'
      }
    });

    // === 16. ASSOCIATE WAF WITH ALB ===
    new wafv2.CfnWebACLAssociation(this, 'WebACLAssociation', {
      resourceArn: alb.loadBalancerArn,
      webAclArn: webAcl.attrArn
    });

    // === 17. OUTPUTS ===
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: alb.loadBalancerDnsName,
      description: 'DNS name of the load balancer'
    });

    new cdk.CfnOutput(this, 'FrontendURL', {
      value: `http://${alb.loadBalancerDnsName}`,
      description: 'Frontend URL'
    });

    new cdk.CfnOutput(this, 'BackendURL', {
      value: `http://${alb.loadBalancerDnsName}/api`,
      description: 'Backend API URL'
    });

    new cdk.CfnOutput(this, 'DatabaseClusterArn', {
      value: dbCluster.clusterArn,
      description: 'Aurora Cluster ARN'
    });

    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: dbCredentialsSecret.secretArn,
      description: 'Aurora Credentials Secret ARN'
    });
  }
}