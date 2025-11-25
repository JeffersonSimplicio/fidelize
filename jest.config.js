/** @type {import('jest').Config} */

module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>/core"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],

  collectCoverageFrom: [
    "core/**/*.{ts,tsx}",
    "!core/**/index.{ts,tsx}",
    "!core/**/*.d.ts",
    "!core/**/*.interface.ts",
    "!core/**/__tests__/**",
    "!core/**/migrations/**",
    "!core/**/errors/**",
    "!core/**/constants/**",
    "!core/**/factories/**",
    "!core/**/database/drizzle/**",
    "!core/**/zod/schemas/**",
    "!core/**/*.(spec|test).{ts,tsx,js}",
    "!core/**/query-models/**",
    "!core/**/application/(dtos|results)/**",
    "!core/**/validation-field-labels.ts",
    "!core/**/reward.status.ts",
    "!core/**/usecase-result-handler.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "cobertura"],
};
