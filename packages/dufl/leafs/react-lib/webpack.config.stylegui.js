'use strict';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const { DefinePlugin } = require('webpack');

module.exports = ({ paths, env, alias }) => {
  const isProd = env.raw.NODE_ENV === 'production';

  return {
    performance: false,
    mode: env.raw.NODE_ENV,
    resolve: {
      alias,
      plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
      extensions: ['.mjs', '.js', '.json'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              test: /\.(js|mjs)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-dufl/webpack-overrides',
                ),
                presets: [
                  [
                    require.resolve('babel-preset-dufl'),
                    { platform: 'web', emotion: true },
                  ],
                ],
                plugins: [],
                babelrc: false,
                configFile: false,
                cacheDirectory: true,
                cacheCompression: isProd,
                compact: isProd,
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
                cacheCompression: isProd,
                sourceMaps: false,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleNotFoundPlugin(paths.appPath),
      new CaseSensitivePathsPlugin(),
      new DefinePlugin(env.stringified),
    ],
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
