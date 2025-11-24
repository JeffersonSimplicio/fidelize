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
    "!core/**/__tests__/**",
    "!core/**/migrations/**",
    "!core/**/types/**",
    "!core/**/errors/**",
    "!core/**/query-models/**",
    "!core/**/constants/**",
    "!core/**/application/dtos/**",
    "!core/**/application/results/**",
    "!core/**/*.interface.ts",
    "!core/**/*.(spec|test).{ts,tsx,js}",
    "!core/**/validation-field-labels.ts",
    "!core/**/reward.status.ts",
    "!core/**/usecase-result-handler.ts",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "cobertura"],
};
