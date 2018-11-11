'use strict';

const chalk = require('chalk');
const webpack = require('webpack');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const { map, toWebpack } = require('dufl-utils/map-peer-dependencies');

const { base, eslint } = require('../webpack');

module.exports = ({
  versions,
  projectPkg,
  paths,
  output,
  env,
  requiredFiles,
  options,
}) => {
  if (!checkRequiredFiles(requiredFiles(paths))) {
    process.exit(1);
  }

  return Promise.resolve()
    .then(() => {
      // Generate alias map.
      const alias = toWebpack(paths, map(paths));

      console.log(chalk.cyan('Starting watch mode...\n'));

      const args = { versions, paths, output, alias, env, helpers: { eslint } };

      const webpackConfig = base(options.webpack(args), args);

      const compiler = webpack(webpackConfig);

      const watcher = compiler.watch({}, (err, stats) => {
        let messages;

        if (err) {
          if (!err.message) {
            console.log(chalk.red('Failed to compile.\n'));

            printBuildError(err);
          }

          messages = formatWebpackMessages({
            errors: [err.message],
            warnings: [],
          });
        } else {
          messages = formatWebpackMessages(
            stats.toJson({ all: false, warnings: true, errors: true }),
          );
        }

        if (messages.errors.length) {
          // Only keep the first error. Others are often indicative
          // of the same problem, but confuse the reader with noise.
          if (messages.errors.length > 1) {
            messages.errors.length = 1;
          }

          console.log(chalk.red('Failed to compile.\n'));

          return printBuildError(new Error(messages.errors.join('\n\n')));
        }

        const warnings = messages.warnings;

        if (warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.\n'));
          console.log(warnings.join('\n\n'));
        } else {
          console.log(chalk.green('Compiled successfully.\n'));
        }

        console.log();
      });

      ['SIGINT', 'SIGTERM'].forEach(sig => {
        process.on(sig, () => {
          watcher.close();
          process.exit();
        });
      });
    })
    .catch(err => {
      if (err && err.message) {
        console.log(err);
      }

      process.exit(1);
    });
};
