'use strict';

const fs = require('fs');
const chalk = require('chalk');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const openBrowser = require('react-dev-utils/openBrowser');
const styleguidist = require('react-styleguidist');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const { map, toWebpack } = require('dufl-utils/map-peer-dependencies');

const { css, eslint, terser } = require('../webpack');

module.exports = ({
  versions,
  projectPkg,
  paths,
  output,
  requiredFiles,
  env,
  options,
}) => {
  const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 6060;
  const HOST = process.env.HOST || '0.0.0.0';

  if (!checkRequiredFiles(requiredFiles(paths))) {
    process.exit(1);
  }

  const hasReact = fs.existsSync(paths.appNodeModulesPackage('react'));
  const hasReactDom = fs.existsSync(paths.appNodeModulesPackage('react-dom'));

  if (!hasReact || !hasReactDom) {
    console.log(chalk.red('"react" and "react-dom" packages are required.'));

    process.exit(1);
  }

  return choosePort(HOST, DEFAULT_PORT)
    .then(port => {
      if (port == null) {
        // We have not found a port.
        return;
      }

      const alias = {
        ...toWebpack(paths, map(paths)),
        react: paths.appNodeModulesPackage('react'),
        'react-dom': paths.appNodeModulesPackage('react-dom'),
      };

      const args = {
        projectPkg,
        versions,
        paths,
        output,
        alias,
        env,
        helpers: { css, eslint, terser },
      };

      const webpackConfig = options.webpack(args);

      styleguidist({
        components: './src/**/[A-Z]*.js',
        webpackConfig,
        serverHost: HOST,
        serverPort: port,
      }).server((err, config) => {
        if (err) {
          return console.log(err);
        }

        const url = `http://localhost:${config.serverPort}`;

        console.log(chalk.green(`Styleguide server is running -> ${url}`));

        openBrowser(url);
      });
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err.message);
      }

      process.exit(1);
    });
};
