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
    "!core/**/*.interface.ts",
    "!core/**/*.(spec|test).{ts,tsx,js}",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov", "cobertura"],
};
