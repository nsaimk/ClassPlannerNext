// jest.config.js
export default {
  type: "module", 
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  moduleNameMapper: {
    "^axios$": "axios/dist/axios",
  },
  transformIgnorePatterns: ["node_modules/(?!axios)"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
};
