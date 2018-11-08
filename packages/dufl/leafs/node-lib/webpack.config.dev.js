'use strict';

const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');

const shouldUseSourceMap = false;

module.exports = ({ paths, env, output, helpers: { eslint } }) => ({
  devtool: shouldUseSourceMap ? 'inline-source-map' : false,
  entry: [paths.appIndexJs],
  output: {
    libraryTarget: 'commonjs2',
    path: paths.appBuild,
    filename: `${output}.js`,
    pathinfo: true,
  },
  target: 'node',
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
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true,
          // Don't waste time on Gzipping the cache.
          cacheCompression: false,
        },
      },
    ],
  },
  plugins: [new DefinePlugin(env.stringified)],
});
