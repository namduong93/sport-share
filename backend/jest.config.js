/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  coveragePathIgnorePatterns: ['<rootDir>/src/models/', '<rootDir>/src/errors/'],
  moduleNameMapper: {
    // Map to allow imports without .js in TypeScript
    '^(.*)\\.js$': '$1',
  },
};
