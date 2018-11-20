'use strict';

const { DefinePlugin } = require('webpack');

const shouldUseSourceMap = false;

module.exports = ({ paths, env, output, helpers: { eslint } }) => ({
  devtool: shouldUseSourceMap ? 'cheap-module-source-map' : false,
  entry: [paths.appIndexJs],
  output: {
    pathinfo: true,
    libraryTarget: 'commonjs2',
    path: paths.appBuild,
    filename: `${output}.js`,
  },
  module: {
    rules: [
      eslint({ appSrc: paths.appSrc }),
      {
        oneOf: [
          {
            test: /\.(js|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve('babel-preset-dufl/webpack-overrides'),
              presets: [
                [
                  require.resolve('babel-preset-dufl'),
                  { platform: 'web', emotion: true },
                ],
              ],
              plugins: [],
              babelrc: false,
              configFile: false,
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              // Don't waste time on Gzipping the cache.
              cacheCompression: false,
            },
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [
                  require.resolve('babel-preset-dufl/dependencies'),
                  { helpers: true },
                ],
              ],
              babelrc: false,
              configFile: false,
              compact: false,
              cacheDirectory: true,
              cacheCompression: false,
              // If an error happens in a package, it's possible to be
              // because it was compiled. Thus, we don't want the browser
              // debugger to show the original code. Instead, the code
              // being evaluated would be much more helpful.
              sourceMaps: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [new DefinePlugin(env.stringified)],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
});
