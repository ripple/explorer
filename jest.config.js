module.exports = {
  transformIgnorePatterns: ['node_modules/(?!arc)/(?!d3)'],
  moduleNameMapper: {
    'd3-hexbin': '<rootDir>/node_modules/d3-hexbin/build/d3-hexbin.min.js',
    d3: '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!<rootDir>/node_modules/',
    '!src/index.js',
    '!src/i18n.js',
    '!src/i18nTestConfig.js',
    '!src/setupTests.js',
    '!src/setupProxy.js',
    '!src/rootReducer.js',
    '!src/registerServiceWorker.js',
    '!src/containers/shared/images/*',
    '!src/containers/test/*',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'text-summary', 'html'],
}
