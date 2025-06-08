// jest.config.js - Focus on CDK infrastructure tests only
module.exports = {
  testEnvironment: 'node',
  
  // Only run CDK/infrastructure tests
  roots: ['<rootDir>/test', '<rootDir>/cdk/test'],
  
  // Exclude frontend, backend, and e2e tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/frontend/',
    '/backend/', 
    '/tests/e2e/',
    '/.next/',
    '/dist/',
    '/build/'
  ],
  
  testMatch: [
    '**/test/**/*.test.ts',
    '**/cdk/test/**/*.test.ts'
  ],
  
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  
  // TypeScript configuration for ts-jest
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }
  },
  
  collectCoverageFrom: [
    'lib/**/*.{js,ts}',
    'cdk/lib/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/frontend/**',
    '!**/backend/**'
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // Adjusted thresholds for infrastructure focus
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Prevent warnings
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Ignore specific modules that cause issues
  transformIgnorePatterns: [
    'node_modules/(?!(aws-cdk-lib|constructs)/)'
  ]
};