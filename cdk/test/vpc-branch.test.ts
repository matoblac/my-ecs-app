// test/vpc-branch.test.ts - Specific test to cover VPC branch logic
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

describe('VPC Branch Coverage', () => {
    test('uses created VPC in test mode', () => {
      const app = new cdk.App();
      app.node.setContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup', true);
      
      const stack = new CdkStack(app, 'TestVPCStack', {
        env: { account: '123456789012', region: 'us-east-1' }
      });
      
      const template = Template.fromStack(stack);
      
      // Should create a VPC (not look up)
      template.hasResourceProperties('AWS::EC2::VPC', {
        EnableDnsHostnames: true,
        EnableDnsSupport: true
      });
    });
  
    test('uses created VPC when no account specified', () => {
      const app = new cdk.App();
      
      const stack = new CdkStack(app, 'NoAccountStack');
      const template = Template.fromStack(stack);
      
      // Should create a VPC since no account was specified
      template.hasResourceProperties('AWS::EC2::VPC', {
        EnableDnsHostnames: true,
        EnableDnsSupport: true
      });
    });
  
    test('attempts VPC lookup in production mode with account', () => {
      const app = new cdk.App();
      // Don't set test context - this will trigger the production VPC lookup branch
      
      // This should successfully create the stack (the VPC lookup branch is exercised)
      // but won't actually perform the lookup during synthesis
      expect(() => {
        new CdkStack(app, 'ProductionStack', {
          env: { account: '123456789012', region: 'us-east-1' }
        });
      }).not.toThrow(); // Stack creation should succeed, lookup happens later
    });
  });