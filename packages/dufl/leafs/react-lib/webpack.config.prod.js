'use strict';

const { DefinePlugin } = require('webpack');

const shouldUseSourceMap = false;

module.exports = ({ paths, env, output, helpers: { eslint, terser } }) => ({
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  entry: [paths.appIndexJs],
  output: {
    libraryTarget: 'commonjs2',
    path: paths.appBuild,
    filename: `${output}.js`,
  },
  optimization: {
    minimizer: [terser({ shouldUseSourceMap })],
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
                [require.resolve('babel-preset-dufl'), { platform: 'web' }],
              ],
              plugins: [],
              babelrc: false,
              configFile: false,
              cacheDirectory: true,
              cacheCompression: true,
              compact: true,
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
              cacheCompression: true,
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
