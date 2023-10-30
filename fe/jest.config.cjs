module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.{ts,tsx,js}', '**/*.test.{ts,tsx,js}'],
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@assets(.*)$': '<rootDir>/src/assets$1',
    '^@domain(.*)$': '<rootDir>/src/domain$1',
    '^@hooks(.*)$': '<rootDir>/src/hooks$1',
    '^@services(.*)$': '<rootDir>/src/services$1',
    '^@styles(.*)$': '<rootDir>/src/styles$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@routes(.*)$': '<rootDir>/src/routes$1',
    '^@stores(.*)$': '<rootDir>/src/stores$1',
    '\\.(css|svg|png|jpg)$': 'identity-obj-proxy', // Mock berkas CSS
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  verbose: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/swc-jest.config.cjs',
  },
  transformIgnorePatterns: ['/node_modules/(?!@babel/runtime|ky)'],
  setupFilesAfterEnv: ['<rootDir>/src/setup-test.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
