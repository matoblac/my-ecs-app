// test/security.test.ts
import { SecurityTestUtils } from './utils/security-tests';
import { TestUtils } from './utils/test-helpers';

describe('Security Configuration Tests', () => {
    let template: any;
  
    beforeEach(() => {
      const { template: testTemplate } = TestUtils.createTestStack();
      template = testTemplate;
    });
  
    test('WAF is properly configured', () => {
      const wafConfig = SecurityTestUtils.verifyWAFConfiguration(template);
      
      expect(wafConfig.hasWebACL).toBe(true);
      expect(wafConfig.hasManagedRules).toBe(true);
      expect(wafConfig.hasRateLimit).toBe(true);
      expect(wafConfig.hasAssociation).toBe(true);
    });
  
    test('IAM permissions are correctly configured', () => {
      // Check that IAM roles exist and have inline policies
      const roles = template.findResources('AWS::IAM::Role');
      const roleArray = Object.values(roles);
      
      // Should have at least 2 roles (execution + task role)
      expect(roleArray.length).toBeGreaterThanOrEqual(2);
      
      // Check for inline policies
      const hasInlinePolicies = roleArray.some((role: any) =>
        role.Properties?.Policies && role.Properties.Policies.length > 0
      );
      
      expect(hasInlinePolicies).toBe(true);
    });
  
    test('ECS task has appropriate security configuration', () => {
      // Verify task definition security
      template.hasResourceProperties('AWS::ECS::TaskDefinition', {
        NetworkMode: 'awsvpc', // Required for Fargate security
        RequiresCompatibilities: ['FARGATE']
      });
    });
});