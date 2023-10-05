const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import ('jest').Config} */
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  preset: 'ts-jest',
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "test-results/junit" }]
  ]
}

module.exports = createJestConfig(config)
