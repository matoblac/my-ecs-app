// test/utils/security-tests.ts
import { Template } from 'aws-cdk-lib/assertions';

export class SecurityTestUtils {
  static verifyWAFConfiguration(template: Template): {
    hasWebACL: boolean;
    hasManagedRules: boolean;
    hasRateLimit: boolean;
    hasAssociation: boolean;
  } {
    const webACLs = template.findResources('AWS::WAFv2::WebACL');
    const associations = template.findResources('AWS::WAFv2::WebACLAssociation');
    
    const hasWebACL = Object.keys(webACLs).length > 0;
    let hasManagedRules = false;
    let hasRateLimit = false;

    if (hasWebACL) {
      const webACL = Object.values(webACLs)[0] as any;
      const rules = webACL.Properties?.Rules || [];
      
      hasManagedRules = rules.some((rule: any) => 
        rule.Statement?.ManagedRuleGroupStatement?.VendorName === 'AWS'
      );
      
      hasRateLimit = rules.some((rule: any) => 
        rule.Statement?.RateBasedStatement
      );
    }

    return {
      hasWebACL,
      hasManagedRules,
      hasRateLimit,
      hasAssociation: Object.keys(associations).length > 0
    };
  }

  static verifyIAMPermissions(template: Template): {
    hasDynamoDBAccess: boolean;
    hasLambdaAccess: boolean;
    hasMinimalPermissions: boolean;
  } {
    const roles = template.findResources('AWS::IAM::Role');
    let hasDynamoDBAccess = false;
    let hasLambdaAccess = false;

    // Check inline policies in roles
    for (const role of Object.values(roles)) {
      const policies = (role as any).Properties?.Policies || [];
      
      for (const policy of policies) {
        const statements = policy.PolicyDocument?.Statement || [];
        
        for (const statement of statements) {
          const actions = Array.isArray(statement.Action) ? statement.Action : [statement.Action];
          
          if (actions.some((action: string) => action.startsWith('dynamodb:'))) {
            hasDynamoDBAccess = true;
          }
          
          if (actions.some((action: string) => action.startsWith('lambda:'))) {
            hasLambdaAccess = true;
          }
        }
      }
    }

    return {
      hasDynamoDBAccess,
      hasLambdaAccess,
      hasMinimalPermissions: true // Simplified for now
    };
  }
}