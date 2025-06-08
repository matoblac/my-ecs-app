// test/performance.test.ts
import { TestUtils } from './utils/test-helpers';
import { Template } from 'aws-cdk-lib/assertions';


describe('Performance and Resource Optimization', () => {
  test('container memory allocation is appropriate', () => {
    const { template } = TestUtils.createTestStack();
    const containers = TestUtils.getContainerDefinitions(template);
    
    const totalMemory = containers.reduce((sum, container) => sum + container.Memory, 0);
    const taskMemory = 2048; // From task definition
    
    // Ensure we're not over-allocating memory
    expect(totalMemory).toBeLessThanOrEqual(taskMemory);
    
    // Ensure backend gets more memory than frontend (it does more work)
    const frontend = containers.find(c => c.Name === 'FrontendContainer');
    const backend = containers.find(c => c.Name === 'BackendContainer');
    
    expect(backend.Memory).toBeGreaterThan(frontend.Memory);
  });

  test('health check configuration is optimal', () => {
    const { template } = TestUtils.createTestStack();
    
    // Just check that health check paths are configured correctly
    const targetGroups = template.findResources('AWS::ElasticLoadBalancingV2::TargetGroup');
    const tgArray = Object.values(targetGroups);
    
    expect(tgArray).toHaveLength(2);
    
    // Verify health check paths exist (don't check protocol as CDK doesn't set it explicitly)
    const healthCheckPaths = tgArray.map((tg: any) => 
      tg.Properties?.HealthCheckPath
    );
    
    expect(healthCheckPaths).toContain('/');
    expect(healthCheckPaths).toContain('/health');
    
    // Verify both target groups use HTTP protocol  
    const protocols = tgArray.map((tg: any) => tg.Properties?.Protocol);
    expect(protocols).toEqual(['HTTP', 'HTTP']);
  });
});