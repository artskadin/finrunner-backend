module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  coverageProvider: 'v8',
  moduleMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
