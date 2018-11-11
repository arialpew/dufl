'use strict';

const chalk = require('chalk');
const jsome = require('jsome');
const fs = require('fs-extra');
const webpack = require('webpack');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printBuildError = require('react-dev-utils/printBuildError');
const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require('react-dev-utils/FileSizeReporter');
const { map, toWebpack } = require('dufl-utils/map-peer-dependencies');

const { base, css, eslint, terser } = require('../webpack');

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

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

  // First, read the current file sizes in build directory.
  // This lets us display how much they changed later.
  return measureFileSizesBeforeBuild(paths.appBuild)
    .then(previousFileSizes => {
      // Generate alias map.
      const alias = toWebpack(paths, map(paths));

      console.log(chalk.cyan('Generating alias map ...\n'));

      if (Object.keys(alias).length >= 1) {
        jsome(alias);
        console.log();
      } else {
        console.log(chalk.cyan('Empty alias map ...\n'));
      }

      // Remove all content but keep the directory so that
      // if you're in it, you don't end up in Trash.
      fs.emptyDirSync(paths.appBuild);
      // Merge with the public folder.
      if (fs.existsSync(paths.appPublic)) {
        fs.copySync(paths.appPublic, paths.appBuild, {
          dereference: true,
          filter: file => file !== paths.appHtml,
        });
      }

      console.log(chalk.cyan('Creating an optimized production build ...'));
      console.log();

      const args = {
        versions,
        paths,
        output,
        alias,
        env,
        helpers: { css, eslint, terser },
      };

      const webpackConfig = base(options.webpack(args), args);

      const compiler = webpack(webpackConfig);

      return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
          let messages;

          if (err) {
            if (!err.message) {
              return reject(err);
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

            return reject(new Error(messages.errors.join('\n\n')));
          }

          const resolveArgs = {
            stats,
            previousFileSizes,
            warnings: messages.warnings,
          };

          return resolve(resolveArgs);
        });
      });
    })
    .then(
      ({ stats, previousFileSizes, warnings }) => {
        if (warnings.length) {
          console.log(chalk.yellow('Compiled with warnings.\n'));
          console.log(warnings.join('\n\n'));
        } else {
          console.log(chalk.green('Compiled successfully.\n'));
        }

        console.log('File sizes after gzip :\n');

        printFileSizesAfterBuild(
          stats,
          previousFileSizes,
          paths.appBuild,
          WARN_AFTER_BUNDLE_GZIP_SIZE,
          WARN_AFTER_CHUNK_GZIP_SIZE,
        );

        console.log();
      },
      err => {
        console.log(chalk.red('Failed to compile.\n'));

        printBuildError(err);
        process.exit(1);
      },
    )
    .catch(err => {
      if (err && err.message) {
        console.log(err);
      }

      process.exit(1);
    });
};
