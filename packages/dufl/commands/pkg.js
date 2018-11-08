'use strict';

const { exec } = require('pkg');
const chalk = require('chalk');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

const generateVersion = node =>
  ['linux-x64', 'win-x64', 'macos-x64']
    .map(os => `node${node}-${os}`)
    .join(',');

module.exports = async ({ paths, output, requiredFiles }) => {
  if (!checkRequiredFiles(requiredFiles(paths))) {
    process.exit(1);
  }

  const nodeVersion = 10;

  console.log(
    chalk.cyan(
      `Creating binaries with Node.js v${nodeVersion} embedded + your app, for Windows/MacOS/Linux x64 ...`,
    ),
  );

  try {
    await exec([
      paths.resolver('build', `${output}.js`),
      '--targets',
      generateVersion(nodeVersion),
      '--output',
      paths.resolver('bin', output),
    ]);

    console.log(chalk.green('Packaged successfully.\n'));
  } catch (err) {
    console.log(chalk.red('Failed to package.\n'));

    if (err && err.message) {
      console.log(err);
    }

    process.exit(1);
  }
};
