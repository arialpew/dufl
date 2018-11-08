'use strict';

const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const PeerDepsExternalsPlugin = require('peer-deps-externals-webpack-plugin');

module.exports = (customConfig, { paths, env, alias }) => ({
  ...customConfig,
  mode: env.raw.NODE_ENV,
  output: {
    ...(customConfig.output || {}),
    // Point sourcemap entries to original disk location (format as URL on Windows).
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  resolve: {
    ...(customConfig.resolve || {}),
    alias,
    plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
    extensions: ['.mjs', '.js', '.json'],
  },
  module: {
    ...(customConfig.module || {}),
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      ...(customConfig.module ? customConfig.module.rules || {} : {}),
    ],
  },
  plugins: [
    new PeerDepsExternalsPlugin(),
    new ModuleNotFoundPlugin(paths.appPath),
    new CaseSensitivePathsPlugin(),
    ...(customConfig.plugins || []),
  ],
  performance: false,
});
