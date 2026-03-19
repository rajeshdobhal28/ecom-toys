import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    // Handle CSS/SCSS modules
    "\\.module\\.(css|scss)$": "identity-obj-proxy",
    "\\.(css|scss)$": "identity-obj-proxy",

    // Handle @/* path alias
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
