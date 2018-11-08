'use strict';

const path = require('path');

const { validateBoolOption } = require('./validate');

module.exports = (api, opts) => {
  if (!opts) {
    opts = {};
  }

  // This is similar to how `env` works in Babel:
  // https://babeljs.io/docs/usage/babelrc/#env-option
  // We are not using `env` because it’s ignored in versions > babel-core@6.10.4:
  // https://github.com/babel/babel/issues/4539
  // https://github.com/facebook/create-react-app/issues/720
  // It’s also nice that we can enforce `NODE_ENV` being specified.
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const isEnvDevelopment = env === 'development';
  const isEnvProduction = env === 'production';
  const isEnvTest = env === 'test';

  const areHelpersEnabled = validateBoolOption('helpers', opts.helpers, false);
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
    // Babel assumes ES Modules, which isn't safe until CommonJS
    // dies. This changes the behavior to assume CommonJS unless
    // an `import` or `export` is present in the file.
    // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
    sourceType: 'unambiguous',
    presets: [
      isEnvTest && [
        // ES features necessary for user's Node version.
        require('@babel/preset-env').default,
        {
          targets: node,
          // Do not transform modules to CJS.
          modules: false,
          // Exclude transforms that make all code slower.
          exclude: ['transform-typeof-symbol'],
        },
      ],
      (isEnvProduction || isEnvDevelopment) && [
        // Latest stable ECMAScript features
        require('@babel/preset-env').default,
        {
          targets: browsers,
          // If users import all core-js they're probably not concerned with
          // bundle size. We shouldn't rely on magic to try and shrink it.
          ignoreBrowserslistConfig: true,
          useBuiltIns: false,
          // Do not transform modules to CJS.
          modules: false,
          // Exclude transforms that make all code slower.
          exclude: ['transform-typeof-symbol'],
        },
      ],
    ].filter(Boolean),
    plugins: [
      // Polyfills the runtime needed.
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
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
      // Adds syntax support for import().
      require('@babel/plugin-syntax-dynamic-import').default,
      // Transform dynamic import to require.
      isEnvTest && require('babel-plugin-transform-dynamic-import').default,
    ].filter(Boolean),
  };
};
