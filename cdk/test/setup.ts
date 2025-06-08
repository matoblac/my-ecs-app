// test/setup.ts - global test setup
import 'aws-sdk-client-mock-jest';

// Global test setup
beforeAll(() => {
  // Set environment variables for tests
  process.env.CDK_DEFAULT_REGION = 'us-east-1';
  process.env.CDK_DEFAULT_ACCOUNT = '123456789012';
});

afterAll(() => {
  // Cleanup
  delete process.env.CDK_DEFAULT_REGION;
  delete process.env.CDK_DEFAULT_ACCOUNT;
});