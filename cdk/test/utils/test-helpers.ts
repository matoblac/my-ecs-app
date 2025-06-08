// test/utils/test-helpers.ts
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../../lib/cdk-stack';

export interface TestStackProps {
  environmentName?: string;
  region?: string;
}

export class TestUtils {
  static createTestStack(props: TestStackProps = {}): { stack: CdkStack; template: Template } {
    const app = new cdk.App();
    // Set context to avoid VPC lookup issues in tests
    app.node.setContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup', true);
    
    const stack = new CdkStack(app, 'TestStack', {
      env: {
        region: props.region || 'us-east-1',
        account: '123456789012'
      }
    });
    
    return {
      stack,
      template: Template.fromStack(stack)
    };
  }

  static findResourcesByType(template: Template, resourceType: string): any[] {
    const resources = template.toJSON().Resources;
    return Object.entries(resources)
      .filter(([_, resource]) => (resource as any).Type === resourceType)
      .map(([key, resource]) => ({ key, ...(resource as object) }));
  }

  static getContainerDefinitions(template: Template): any[] {
    const taskDefs = this.findResourcesByType(template, 'AWS::ECS::TaskDefinition');
    if (taskDefs.length === 0) return [];
    
    const taskDef = taskDefs[0] as any;
    return taskDef.Properties?.ContainerDefinitions || [];
  }

  static verifyContainerConfiguration(
    containers: any[], 
    containerName: string, 
    expectedConfig: Partial<{
      port: number;
      memory: number;
      environment: Record<string, string>;
    }>
  ): boolean {
    const container = containers.find(c => c.Name === containerName);
    if (!container) return false;

    if (expectedConfig.port) {
      const hasCorrectPort = container.PortMappings?.some(
        (pm: any) => pm.ContainerPort === expectedConfig.port
      );
      if (!hasCorrectPort) return false;
    }

    if (expectedConfig.memory && container.Memory !== expectedConfig.memory) {
      return false;
    }

    if (expectedConfig.environment) {
      const envVars = container.Environment || [];
      for (const [key, value] of Object.entries(expectedConfig.environment)) {
        const hasEnvVar = envVars.some(
          (env: any) => env.Name === key && env.Value === value
        );
        if (!hasEnvVar) return false;
      }
    }

    return true;
  }
}
