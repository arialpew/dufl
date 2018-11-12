'use strict';

const fs = require('fs');

const mapPeerDependencies = require('dufl-utils/map-peer-dependencies');

module.exports = (paths, resolve, rootDir, isEjecting) => {
  const alias = mapPeerDependencies.toJest(
    paths,
    mapPeerDependencies.map(paths),
  );

  // Use this instead of `paths.testsSetup` to avoid putting
  // an absolute filename into configuration after ejecting.
  const setupTestsMatches = paths.testsSetup.match(/src\/setupTests\.(.+)/);

  const setupTestsFileExtension =
    (setupTestsMatches && setupTestsMatches[1]) || 'js';

  const setupTestsFile = fs.existsSync(paths.testsSetup)
    ? `<rootDir>/src/setupTests.${setupTestsFileExtension}`
    : undefined;

  // TODO: I don't know if it's safe or not to just use / as path separator
  // in Jest configs. We need help from somebody with Windows to determine this.
  const config = {
    collectCoverageFrom: ['src/**/*.js'],
    setupFiles: [require.resolve('react-app-polyfill/jsdom')],
    setupTestFrameworkScriptFile: setupTestsFile,
    testMatch: [
      '<rootDir>/src/**/__tests__/**/*.js',
      '<rootDir>/src/**/?(*.)(spec|test).js',
    ],
    testEnvironment: 'jsdom',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.js$': resolve('./jest/babelTransform.js'),
      '^.+\\.css$': resolve('./jest/cssTransform.js'),
      '^(?!.*\\.(js|css|json)$)': resolve('./jest/fileTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.js$',
      '^.+\\.module\\.css$',
    ],
    moduleNameMapper: {
      '^.+\\.module\\.css$': require.resolve('identity-obj-proxy'),
      ...alias,
    },
    moduleFileExtensions: ['js', 'json', 'node'],
  };

  if (rootDir) {
    config.rootDir = rootDir;
  }

  return config;
};
