import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);

    // === 1. NETWORKING ===
    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });
    
    // === 2. ECR REPOSITORIES ===
    const frontendRepo = ecr.Repository.fromRepositoryName(this, 'FrontendRepo', 'chatbot-frontend');
    const backendRepo = ecr.Repository.fromRepositoryName(this, 'BackendRepo', 'chatbot-backend');

    // === 3. ECS CLUSTER ===
    const cluster = new ecs.Cluster(this, 'ChatbotCluster', {
      vpc,
      clusterName: 'chatbot-cluster'
    });

    // === 4. TASK EXECUTION ROLE ===
    const taskExecutionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
      ]
    });

    // === 5. TASK ROLE (for AWS SDK calls) ===
    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      inlinePolicies: {
        DynamoDBPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                // example actions:
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
        })
      }
    });

    // === 6. LOG GROUPS ===
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

    // === 7. TASK DEFINITION ===
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'ChatbotTaskDefinition', {
      memoryLimitMiB: 2048,
      cpu: 1024,
      executionRole: taskExecutionRole,
      taskRole: taskRole
    });

    // === 8. FRONTEND CONTAINER ===
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

    // === 9. BACKEND CONTAINER ===
    const backendContainer = taskDefinition.addContainer('BackendContainer', {
      image: ecs.ContainerImage.fromEcrRepository(backendRepo, 'latest'),
      memoryLimitMiB: 1536,
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'backend',
        logGroup: backendLogGroup
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: '8080'
      }
    });

    backendContainer.addPortMappings({
      containerPort: 8080,
      protocol: ecs.Protocol.TCP
    });

    // === 10. ECS SERVICE ===
    const service = new ecs.FargateService(this, 'ChatbotService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
      assignPublicIp: true, // Required for pulling images from ECR
      serviceName: 'chatbot-service'
    });

    // === 11. APPLICATION LOAD BALANCER ===
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ChatbotALB', {
      vpc,
      internetFacing: true,
      loadBalancerName: 'chatbot-alb'
    });

    // === 12. TARGET GROUPS ===
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

    // === 13. ALB LISTENERS ===
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

    // === 14. WAF WEB ACL ===
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

    // === 15. ASSOCIATE WAF WITH ALB ===
    new wafv2.CfnWebACLAssociation(this, 'WebACLAssociation', {
      resourceArn: alb.loadBalancerArn,
      webAclArn: webAcl.attrArn
    });

    // === 16. OUTPUTS ===
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
  }
}