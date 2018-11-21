'use strict';

const fs = require('fs');
const chalk = require('chalk');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const styleguidist = require('react-styleguidist');
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
  if (!checkRequiredFiles(requiredFiles(paths))) {
    process.exit(1);
  }

  const hasReact = fs.existsSync(paths.appNodeModulesPackage('react'));
  const hasReactDom = fs.existsSync(paths.appNodeModulesPackage('react-dom'));

  if (!hasReact || !hasReactDom) {
    console.log(chalk.red('"react" and "react-dom" packages are required.'));

    process.exit(1);
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
  }).build((err, config) => {
    if (err) {
      return console.log(err);
    }

    console.log(
      chalk.green(
        `Compiled styleguide successfully to "${config.styleguideDir}"`,
      ),
    );
  });
};
