'use strict';

const path = require('path');

const { validateBoolOption, validatePlatform } = require('./validate');

module.exports = (api, opts, env) => {
  if (!opts) {
    opts = {};
  }

  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const isEnvTest = env === 'test';

  const areHelpersEnabled = validateBoolOption('helpers', opts.helpers, true);
  const isEmotionEnabled = validateBoolOption('emotion', opts.emotion, false);
  const platform = validatePlatform('platform', opts.platform);
  const isNodePlatform = platform === 'node';
  const isWebPlatform = platform === 'web';
  const useAbsoluteRuntime = validateBoolOption(
    'absoluteRuntime',
    opts.absoluteRuntime,
    true,
  );

  let absoluteRuntimePath;

  if (useAbsoluteRuntime) {
    absoluteRuntimePath = path.dirname(
      require.resolve('@babel/runtime/package.json'),
    );
  }

  if (!isEnvDevelopment && !isEnvProduction && !isEnvTest) {
    throw new Error(`
      Using "babel-preset-dufl" requires that you specify "NODE_ENV" or "BABEL_ENV" environment variables.

      Valid values are "development", "test" and "production".

      Instead, received : ${JSON.stringify(env)}.
    `);
  }

  const node = {
    node: 'current',
  };

  const browsers = {
    browsers:
      'last 2 Chrome version, last 1 Edge version, last 1 Firefox version, last 1 Safari version, last 1 and_chr version, last 1 ios_saf version',
  };

  return {
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version.
        require('@babel/preset-env').default,
        {
          targets: {
            node: 'current',
          },
        },
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require('@babel/preset-env').default,
        {
          targets: isNodePlatform ? node : browsers,
          // If users import all core-js they're probably not concerned with
          // bundle size. We shouldn't rely on magic to try and shrink it.
          ignoreBrowserslistConfig: true,
          useBuiltIns: false,
          // Do not transform modules to CJS
          modules: false,
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
        },
      ],
      (isEnvTest || isWebPlatform) && [
        require('@babel/preset-react').default,
        {
          // Adds component stack to warning messages.
          // Adds __self attribute to JSX which React will use for some warnings.
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill behavior for any plugins that require one.
          useBuiltIns: true,
        },
      ],
    ].filter(Boolean),
    plugins: [
      // Experimental macros support.
      require('babel-plugin-macros'),
      // Enable loose mode to use assignment instead of defineProperty.
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require('@babel/plugin-proposal-class-properties').default,
        {
          loose: true,
        },
      ],
      // Polyfills the runtime needed.
      [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          helpers: areHelpersEnabled,
          regenerator: false,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS supports ES Modules.
          useESModules: isEnvDevelopment || isEnvProduction,
          // Undocumented option that lets us encapsulate our runtime, ensuring the correct version is used.
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: absoluteRuntimePath,
        },
      ],
      isEnvProduction && [
        // Remove PropTypes from production build.
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true,
        },
      ],
      // Adds syntax support for import().
      require('@babel/plugin-syntax-dynamic-import').default,
      // Transform dynamic import to require.
      isEnvTest && require('babel-plugin-dynamic-import-node'),
      // Emotion CSS transformation to avoid runtime cost.
      isEmotionEnabled && require('babel-plugin-emotion').default,
    ].filter(Boolean),
  };
};
