export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^nanoid$": "<rootDir>/src/__tests__/__mocks__/nanoid.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "esnext",
          moduleResolution: "bundler",
          target: "ES2022",
          isolatedModules: true,
        },
      },
    ],
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/server.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testTimeout: 10000,
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  // Ensure Jest doesn't try to use dist files
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  // Transform ignore patterns - ensure node_modules are not transformed except for ESM packages
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$|better-sqlite3|nanoid))",
  ],
};
