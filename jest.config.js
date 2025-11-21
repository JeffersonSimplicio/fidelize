module.exports = {
  preset: "jest-expo",
  roots: ["<rootDir>/core"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
};
