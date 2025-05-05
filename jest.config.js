module.exports = {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    roots: ['<rootDir>/src', '<rootDir>/public'], //change 1
    moduleNameMapper: {
      '^public/(.*)$': '<rootDir>/public/$1'
    }, //change 2
    moduleDirectories: ['node_modules', 'public'], //change 3
    transformIgnorePatterns: ['node_modules/(?!firebase)'],
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest.setup.js'],

  };
  