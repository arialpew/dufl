'use strict';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  choosePort,
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const { map, toWebpack } = require('dufl-utils/map-peer-dependencies');

const { base, css, eslint } = require('../webpack');

const createDevServerConfig = require('./dev-server');

module.exports = ({
  versions,
  projectPkg,
  output,
  requiredFiles,
  paths,
  options,
  env,
}) => {
  const isInteractive = process.stdout.isTTY;
  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  if (!checkRequiredFiles(requiredFiles(paths))) {
    process.exit(1);
  }

  return choosePort(HOST, DEFAULT_PORT)
    .then(port => {
      if (port == null) {
        // We have not found a port.
        return;
      }

      const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
      const appName = require(paths.appPackageJson).name;
      const urls = prepareUrls(protocol, HOST, port);

      const alias = toWebpack(paths, map(paths));

      const args = {
        versions,
        paths,
        output,
        alias,
        env,
        helpers: { css, eslint },
      };

      const webpackConfig = base(options.webpack(args), args);

      const compiler = createCompiler(
        webpack,
        webpackConfig,
        appName,
        urls,
        false,
      );

      const proxySetting = require(paths.appPackageJson).proxy;
      const proxyConfig = prepareProxy(proxySetting, paths.appPublic);

      const serverConfig = createDevServerConfig(
        proxyConfig,
        urls.lanUrlForConfig,
        paths,
        webpackConfig.output.publicPath,
      );

      const devServer = new WebpackDevServer(compiler, serverConfig);

      devServer.listen(port, HOST, err => {
        if (err) {
          return console.log(err);
        }

        if (isInteractive) {
          clearConsole();
        }

        console.log(chalk.cyan('Starting the development server ...\n'));

        openBrowser(urls.localUrlForBrowser);
      });

      ['SIGINT', 'SIGTERM'].forEach(sig => {
        process.on(sig, () => {
          devServer.close();
          process.exit();
        });
      });
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
      }
      process.exit(1);
    });
};
