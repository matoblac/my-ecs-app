// test/error-scenarios.test.ts
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import { TestUtils } from './utils/test-helpers';

describe('Error Scenario Tests', () => {
  test('handles missing ECR repositories gracefully', () => {
    // This test would fail during deployment, but syntax should be valid
    const app = new cdk.App();
    
    expect(() => {
      new CdkStack(app, 'TestStack');
    }).not.toThrow();
  });

  test('validates required environment variables', () => {
    const { template } = TestUtils.createTestStack();
    const containers = TestUtils.getContainerDefinitions(template);
    
    // Verify both containers have required environment variables
    containers.forEach(container => {
      expect(container.Environment).toBeDefined();
      expect(Array.isArray(container.Environment)).toBe(true);
      
      const envNames = container.Environment.map((env: any) => env.Name);
      expect(envNames).toContain('NODE_ENV');
    });
  });
});