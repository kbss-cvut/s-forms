module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  setupFiles: ['<rootDir>/test/setup.js'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  reporters: ['default']
};
