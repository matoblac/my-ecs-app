// test/integration.test.ts - FIXED VERSION
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

describe('Integration Tests', () => {
  test('stack synthesizes without errors', () => {
    const app = new App();
    app.node.setContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup', true);
    
    expect(() => {
      new CdkStack(app, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' }
      });
    }).not.toThrow();
  });

  test('stack validates CloudFormation limits', () => {
    const app = new App();
    app.node.setContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup', true);
    
    const stack = new CdkStack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' }
    });
    const template = Template.fromStack(stack);
    
    const resources = template.toJSON().Resources;
    const resourceCount = Object.keys(resources).length;
    
    // CloudFormation has a 500 resource limit
    expect(resourceCount).toBeLessThan(500);
  });

  test('all containers have required environment variables', () => {
    const app = new App();
    app.node.setContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup', true);
    
    const stack = new CdkStack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' }
    });
    const template = Template.fromStack(stack);
    
    const taskDef = template.findResources('AWS::ECS::TaskDefinition');
    const taskDefProps = Object.values(taskDef)[0] as any;
    
    const containers = taskDefProps.Properties.ContainerDefinitions;
    
    // Verify each container has environment variables
    containers.forEach((container: any) => {
      expect(container.Environment).toBeDefined();
      expect(Array.isArray(container.Environment)).toBe(true);
      expect(container.Environment.length).toBeGreaterThan(0);
    });
  });
});