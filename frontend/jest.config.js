/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.test.json'
    }],
  },
  testMatch: ['<rootDir>/tests/**/*.(test|spec).(ts|tsx)',
    '<rootDir>/__tests__/**/*.(test|spec).(ts|tsx)'
  ],

};
  