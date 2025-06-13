import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

describe('AllenAI Chatbot Infrastructure', () => {
  let app: cdk.App;
  let stack: CdkStack;
  let template: Template;

  beforeAll(() => {
    // Set up the test environment
    app = new cdk.App({
      context: {
        '@aws-cdk/aws-ec2:restrictDefaultSecurityGroup': true, // Triggers test mode
      }
    });
    
    stack = new CdkStack(app, 'TestChatbotStack');
    template = Template.fromStack(stack);
  });

  describe('Core Infrastructure Components', () => {
    test('should create VPC for networking', () => {
      template.hasResourceProperties('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16'
      });
    });

    test('should create Aurora PostgreSQL database with correct configuration', () => {
      template.hasResourceProperties('AWS::RDS::DBCluster', {
        Engine: 'aurora-postgresql',
        DatabaseName: 'AllenAIDB',
        EngineMode: 'serverless',
        EngineVersion: '13.13',
        ScalingConfiguration: {
          AutoPause: true,
          MinCapacity: 2,
          MaxCapacity: 8,
          SecondsUntilAutoPause: 600
        }
      });
    });

    test('should create database credentials secret', () => {
      template.hasResourceProperties('AWS::SecretsManager::Secret', {
        Name: 'AllenAIUserDBCredentials',
        GenerateSecretString: {
          SecretStringTemplate: '{"username":"allenaiuser"}',
          GenerateStringKey: 'password'
        }
      });
    });
  });

  describe('Container Infrastructure', () => {
    test('should create ECS cluster', () => {
      template.hasResourceProperties('AWS::ECS::Cluster', {
        ClusterName: 'chatbot-cluster'
      });
    });

    test('should create Fargate task definition with correct resource allocation', () => {
      template.hasResourceProperties('AWS::ECS::TaskDefinition', {
        Cpu: '1024',
        Memory: '2048',
        NetworkMode: 'awsvpc',
        RequiresCompatibilities: ['FARGATE']
      });
    });

    test('should create ECS service with desired configuration', () => {
      template.hasResourceProperties('AWS::ECS::Service', {
        ServiceName: 'chatbot-service',
        DesiredCount: 1,
        LaunchType: 'FARGATE'
      });
    });
  });

  describe('Load Balancing and Routing', () => {
    test('should create internet-facing application load balancer', () => {
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
        Name: 'chatbot-alb',
        Scheme: 'internet-facing',
        Type: 'application'
      });
    });

    test('should create target groups for frontend and backend', () => {
      // Frontend target group
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
        Port: 3000,
        Protocol: 'HTTP',
        TargetType: 'ip'
      });

      // Backend target group
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
        Port: 8080,
        Protocol: 'HTTP',
        TargetType: 'ip'
      });
    });

    test('should configure listener with API routing rule', () => {
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
        Priority: 1,
        Conditions: [{
          Field: 'path-pattern',
          PathPatternConfig: {
            Values: ['/api/*']
          }
        }]
      });
    });
  });

  describe('Security and Monitoring', () => {
    test('should create WAF with security rules', () => {
      template.hasResourceProperties('AWS::WAFv2::WebACL', {
        Name: 'chatbot-web-acl',
        Scope: 'REGIONAL',
        DefaultAction: { Allow: {} }
      });

      // Check for rate limiting rule
      const webAcl = template.findResources('AWS::WAFv2::WebACL');
      const webAclResource = Object.values(webAcl)[0] as any;
      const rateLimitRule = webAclResource.Properties.Rules.find(
        (rule: any) => rule.Name === 'RateLimitRule'
      );
      
      expect(rateLimitRule).toBeDefined();
      expect(rateLimitRule.Statement.RateBasedStatement.Limit).toBe(2000);
    });

    test('should create IAM roles with appropriate permissions', () => {
      // Task execution role
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [{
            Effect: 'Allow',
            Principal: { Service: 'ecs-tasks.amazonaws.com' }
          }]
        }
      });
    });

    test('should create CloudWatch log groups', () => {
      template.hasResourceProperties('AWS::Logs::LogGroup', {
        LogGroupName: '/ecs/chatbot-frontend',
        RetentionInDays: 7
      });

      template.hasResourceProperties('AWS::Logs::LogGroup', {
        LogGroupName: '/ecs/chatbot-backend',
        RetentionInDays: 7
      });
    });
  });

  describe('Integration Validation', () => {
    test('should have correct resource counts for complete system', () => {
      // Verify we have all the major components
      const resources = template.toJSON().Resources;
      const resourceTypes = Object.values(resources).map((r: any) => r.Type);

      expect(resourceTypes).toContain('AWS::EC2::VPC');
      expect(resourceTypes).toContain('AWS::RDS::DBCluster');
      expect(resourceTypes).toContain('AWS::ECS::Cluster');
      expect(resourceTypes).toContain('AWS::ECS::Service');
      expect(resourceTypes).toContain('AWS::ElasticLoadBalancingV2::LoadBalancer');
      expect(resourceTypes).toContain('AWS::WAFv2::WebACL');
      
      // Should have 2 target groups (frontend + backend)
      const targetGroups = resourceTypes.filter(type => 
        type === 'AWS::ElasticLoadBalancingV2::TargetGroup'
      );
      expect(targetGroups).toHaveLength(2);
    });

    test('should output all required URLs and ARNs', () => {
      template.hasOutput('LoadBalancerDNS', {});
      template.hasOutput('FrontendURL', {});
      template.hasOutput('BackendURL', {});
      template.hasOutput('DatabaseClusterArn', {});
      template.hasOutput('DatabaseSecretArn', {});
    });

    test('should properly connect database permissions to task role', () => {
      // Verify the task role has RDS Data API permissions
      const roles = template.findResources('AWS::IAM::Role');
      
      // Find the task role by looking for RDS Data API permissions
      const taskRole = Object.values(roles).find((role: any) => {
        const policies = role.Properties?.Policies;
        if (!policies || !Array.isArray(policies)) return false;
        
        return policies.some((policy: any) => {
          const statements = policy.PolicyDocument?.Statement;
          if (!statements || !Array.isArray(statements)) return false;
          
          return statements.some((statement: any) => 
            statement.Action?.includes?.('rds-data:ExecuteStatement')
          );
        });
      });
      
      expect(taskRole).toBeDefined();
    });
  });

  describe('Environment Configuration', () => {
    test('should configure containers with correct environment variables', () => {
      const taskDef = template.findResources('AWS::ECS::TaskDefinition');
      const taskDefResource = Object.values(taskDef)[0] as any;
      const containers = taskDefResource.Properties.ContainerDefinitions;
      
      // Find backend container
      const backendContainer = containers.find((c: any) => 
        c.Environment?.some((env: any) => env.Name === 'PORT' && env.Value === '8080')
      );
      
      expect(backendContainer).toBeDefined();
      expect(backendContainer.Environment).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ Name: 'NODE_ENV', Value: 'production' }),
          expect.objectContaining({ Name: 'DB_NAME', Value: 'AllenAIDB' })
        ])
      );
    });
  });
});