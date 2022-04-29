module.exports = {
  roots: ["<rootDir>"],
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"],
  setupFiles: ["<rootDir>/test/setup.js"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$"],
  testEnvironment: "jsdom",
  testURL: "http://localhost",
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  reporters: ["default"],
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/test/__mocks__/styleMock.js",
  },
  globals: {
    "s-forms": {
      tsconfig: "tsconfig.spec.json",
    },
  },
};
