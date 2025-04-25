module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!firebase)'],
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest.setup.js'],

  };
  