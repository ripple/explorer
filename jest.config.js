module.exports = {
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(svg)$': '<rootDir>/testUtils/svgTransform.js',
    '^.+\\.(css|scss)$': '<rootDir>/testUtils/cssTransform.js',
    '^.+\\.(png)$': '<rootDir>/testUtils/imageTransform.js',
  },
  transformIgnorePatterns: ['node_modules/(?!arc)/(?!d3)'],
  moduleNameMapper: {
    'd3-hexbin': '<rootDir>/node_modules/d3-hexbin/build/d3-hexbin.min.js',
    d3: '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
  clearMocks: true,
  resetMocks: true,
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
    '!testUtils/*',
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
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}
