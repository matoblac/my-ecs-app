import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

describe('ChatbotStack', () => {
  let app: cdk.App;
  let stack: CdkStack;
  let template: Template;

  beforeEach(() => {
    app = new cdk.App();
    // Set test context to avoid VPC lookup
    app.node.setContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup', true);
    
    stack = new CdkStack(app, 'TestChatbotStack', {
      env: {
        account: '123456789012',
        region: 'us-east-1'
      }
    });
    template = Template.fromStack(stack);
  });

  describe('Basic Infrastructure', () => {
    test('creates ECS cluster with correct name', () => {
      template.hasResourceProperties('AWS::ECS::Cluster', {
        ClusterName: 'chatbot-cluster'
      });
    });

    test('creates Application Load Balancer', () => {
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', {
        Name: 'chatbot-alb',
        Scheme: 'internet-facing',
        Type: 'application'
      });
    });

    test('creates WAF Web ACL with managed rules', () => {
      template.hasResourceProperties('AWS::WAFv2::WebACL', {
        Name: 'chatbot-web-acl',
        Scope: 'REGIONAL',
        DefaultAction: { Allow: {} }
      });
    });
  });

  describe('Container Configuration', () => {
    test('creates Fargate task definition with correct resources', () => {
      template.hasResourceProperties('AWS::ECS::TaskDefinition', {
        RequiresCompatibilities: ['FARGATE'],
        Memory: '2048',
        Cpu: '1024',
        NetworkMode: 'awsvpc'
      });
    });

    test('configures frontend container correctly', () => {
      template.hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: Match.arrayWith([
          Match.objectLike({
            Name: 'FrontendContainer',
            Memory: 512,
            PortMappings: [
              {
                ContainerPort: 3000,
                Protocol: 'tcp'
              }
            ],
            Environment: Match.arrayWith([
              {
                Name: 'BACKEND_URL',
                Value: 'http://localhost:8080'
              },
              {
                Name: 'NODE_ENV',
                Value: 'production'
              }
            ])
          })
        ])
      });
    });

    test('configures backend container correctly', () => {
      template.hasResourceProperties('AWS::ECS::TaskDefinition', {
        ContainerDefinitions: Match.arrayWith([
          Match.objectLike({
            Name: 'BackendContainer',
            Memory: 1536,
            PortMappings: [
              {
                ContainerPort: 8080,
                Protocol: 'tcp'
              }
            ],
            Environment: Match.arrayWith([
              {
                Name: 'NODE_ENV',
                Value: 'production'
              },
              {
                Name: 'PORT',
                Value: '8080'
              }
            ])
          })
        ])
      });
    });
  });

  describe('Load Balancer Configuration', () => {
    test('creates target groups for frontend and backend', () => {
      // Frontend target group (check key properties only)
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
        Port: 3000,
        Protocol: 'HTTP',
        TargetType: 'ip',
        HealthCheckPath: '/'
      });

      // Backend target group 
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
        Port: 8080,
        Protocol: 'HTTP',
        TargetType: 'ip',
        HealthCheckPath: '/health'
      });
    });

    test('configures listener with correct routing rules', () => {
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
        Port: 80,
        Protocol: 'HTTP'
      });

      // Check for listener rules (API routing)
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
        Priority: 1,
        Conditions: [
          {
            Field: 'path-pattern',
            PathPatternConfig: {
              Values: ['/api/*']
            }
          }
        ]
      });
    });
  });

  describe('Security Configuration', () => {
    test('creates IAM roles for ECS tasks', () => {
      // Task execution role
      template.hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                Service: 'ecs-tasks.amazonaws.com'
              },
              Action: 'sts:AssumeRole'
            }
          ]
        }
      });
    });

    test('creates inline policies for AWS SDK access', () => {
      // Check that we have policies for DynamoDB and Lambda
      const template_json = template.toJSON();
      const roles = Object.values(template_json.Resources).filter(
        (resource: any) => resource.Type === 'AWS::IAM::Role'
      );
      
      const hasInlinePolicies = roles.some((role: any) => 
        role.Properties?.Policies && role.Properties.Policies.length > 0
      );
      
      expect(hasInlinePolicies).toBe(true);
    });

    test('associates WAF with ALB', () => {
      template.hasResourceProperties('AWS::WAFv2::WebACLAssociation', {
        ResourceArn: Match.anyValue(),
        WebACLArn: Match.anyValue()
      });
    });
  });

  describe('WAF Rules Configuration', () => {
    test('includes AWS managed rule sets', () => {
      template.hasResourceProperties('AWS::WAFv2::WebACL', {
        Rules: Match.arrayWith([
          Match.objectLike({
            Name: 'AWSManagedRulesCommonRuleSet',
            Priority: 1,
            Statement: {
              ManagedRuleGroupStatement: {
                VendorName: 'AWS',
                Name: 'AWSManagedRulesCommonRuleSet'
              }
            }
          }),
          Match.objectLike({
            Name: 'AWSManagedRulesKnownBadInputsRuleSet',
            Priority: 2,
            Statement: {
              ManagedRuleGroupStatement: {
                VendorName: 'AWS',
                Name: 'AWSManagedRulesKnownBadInputsRuleSet'
              }
            }
          })
        ])
      });
    });

    test('includes rate limiting rule', () => {
      template.hasResourceProperties('AWS::WAFv2::WebACL', {
        Rules: Match.arrayWith([
          Match.objectLike({
            Name: 'RateLimitRule',
            Priority: 3,
            Action: { Block: {} },
            Statement: {
              RateBasedStatement: {
                Limit: 2000,
                AggregateKeyType: 'IP'
              }
            }
          })
        ])
      });
    });
  });

  describe('Logging Configuration', () => {
    test('creates CloudWatch log groups', () => {
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

  describe('ECS Service Configuration', () => {
    test('creates Fargate service with correct configuration', () => {
      template.hasResourceProperties('AWS::ECS::Service', {
        ServiceName: 'chatbot-service',
        DesiredCount: 1,
        LaunchType: 'FARGATE'
      });
    });

    test('enables public IP assignment for ECR access', () => {
      template.hasResourceProperties('AWS::ECS::Service', {
        NetworkConfiguration: {
          AwsvpcConfiguration: {
            AssignPublicIp: 'ENABLED'
          }
        }
      });
    });
  });

  describe('Resource Counting', () => {
    test('creates expected number of resources', () => {
      const resourceCounts = template.toJSON().Resources;
      
      // Count specific resource types
      const ecsServices = Object.values(resourceCounts).filter(
        (resource: any) => resource.Type === 'AWS::ECS::Service'
      );
      const targetGroups = Object.values(resourceCounts).filter(
        (resource: any) => resource.Type === 'AWS::ElasticLoadBalancingV2::TargetGroup'
      );
      const logGroups = Object.values(resourceCounts).filter(
        (resource: any) => resource.Type === 'AWS::Logs::LogGroup'
      );

      expect(ecsServices).toHaveLength(1);
      expect(targetGroups).toHaveLength(2); // Frontend + Backend
      expect(logGroups).toHaveLength(2); // Frontend + Backend
    });
  });

  describe('Output Validation', () => {
    test('exports required outputs', () => {
      template.hasOutput('LoadBalancerDNS', {
        Description: 'DNS name of the load balancer'
      });

      template.hasOutput('FrontendURL', {
        Description: 'Frontend URL'
      });

      template.hasOutput('BackendURL', {
        Description: 'Backend API URL'
      });
    });
  });
});