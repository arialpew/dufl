'use strict';

const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

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
  target: 'node',
  optimization: {
    minimizer: [terser({ shouldUseSourceMap })],
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      eslint({ appSrc: paths.appSrc }),
      {
        test: /\.(js|mjs)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          customize: require.resolve('babel-preset-dufl/webpack-overrides'),
          presets: [
            [require.resolve('babel-preset-dufl'), { platform: 'node' }],
          ],
          plugins: [],
          babelrc: false,
          configFile: false,
          cacheDirectory: true,
          cacheCompression: true,
          compact: true,
        },
      },
    ],
  },
  plugins: [new DefinePlugin(env.stringified)],
});
