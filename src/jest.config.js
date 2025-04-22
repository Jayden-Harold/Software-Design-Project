module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    transformIgnorePatterns: ['node_modules/(?!firebase)'],
    testEnvironment: 'jsdom', // This is a must!
  };
  