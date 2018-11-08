'use strict';

const jest = require('jest');
const resolve = require('resolve');
const path = require('path');

const createJestConfig = require('../jest/createJestConfig');

module.exports = ({ paths }) => {
  let argv = process.argv.slice(2);

  argv.push(
    '--config',
    JSON.stringify(
      createJestConfig(
        paths,
        relativePath => path.resolve(__dirname, '..', relativePath),
        path.resolve(paths.appSrc, '..'),
        false,
      ),
    ),
  );

  // This is a very dirty workaround for https://github.com/facebook/jest/issues/5913.
  // We're trying to resolve the environment ourselves because Jest does it incorrectly.
  // Remove this as soon as it's fixed in Jest.
  function resolveJestDefaultEnvironment(name) {
    const jestDir = path.dirname(
      resolve.sync('jest', {
        basedir: __dirname,
      }),
    );
    const jestCLIDir = path.dirname(
      resolve.sync('jest-cli', {
        basedir: jestDir,
      }),
    );
    const jestConfigDir = path.dirname(
      resolve.sync('jest-config', {
        basedir: jestCLIDir,
      }),
    );
    return resolve.sync(name, {
      basedir: jestConfigDir,
    });
  }
  let cleanArgv = [];
  let env = 'jsdom';
  let next;
  do {
    next = argv.shift();
    if (next === '--env') {
      env = argv.shift();
    } else if (next.indexOf('--env=') === 0) {
      env = next.substring('--env='.length);
    } else {
      cleanArgv.push(next);
    }
  } while (argv.length > 0);
  argv = cleanArgv;
  let resolvedEnv;
  try {
    resolvedEnv = resolveJestDefaultEnvironment(`jest-environment-${env}`);
  } catch (e) {
    // ignore
  }
  if (!resolvedEnv) {
    try {
      resolvedEnv = resolveJestDefaultEnvironment(env);
    } catch (e) {
      // ignore
    }
  }

  const testEnvironment = resolvedEnv || env;

  argv.push('--env', testEnvironment);

  jest.run(argv);
};
