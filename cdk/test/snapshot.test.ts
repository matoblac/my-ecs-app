// test/snapshot.test.ts
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CdkStack } from '../lib/cdk-stack';

test('CdkStack snapshot', () => {
  const app = new cdk.App();
  app.node.setContext('@aws-cdk/aws-ec2:restrictDefaultSecurityGroup', true);
  
  const stack = new CdkStack(app, 'SnapshotTestStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1'
    }
  });
  const template = Template.fromStack(stack);
  
  // This creates a snapshot of the entire CloudFormation template
  expect(template.toJSON()).toMatchSnapshot();
});
