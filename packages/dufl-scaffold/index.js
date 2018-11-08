#!/usr/bin/env node

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs');
const { dirname } = require('path');
const outdent = require('outdent');
const program = require('caporal');
const { cyan, red, green } = require('chalk');
const writePkg = require('write-pkg');
const makeDir = require('make-dir');
const inquirer = require('inquirer');
const { createPkgJson, isValidPkgName, formatOutput } = require('dufl-utils');
const paths = require('dufl-utils/paths');
const symbols = require('dufl-symbols');

const { name, version, description } = require('./package');

const help = outdent`
   Use scaffold command to make new package.
`;

const currentTool = {
  currentToolName: 'dufl-cli',
  currentToolVersion: version,
};

const ref = program
  .name(name)
  .version(version)
  .description(description)
  .help(cyan(help))
  .action(async () => {
    const validate = value => {
      if (isValidPkgName(value)) {
        return true;
      }

      return red('This name is not valid');
    };

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Package name ?',
        validate,
      },
      {
        type: 'list',
        name: 'type',
        message: 'Package type ?',
        choices: [
          {
            name: 'React App',
            value: symbols.leafs.REACT_APP,
          },
          {
            name: 'React Library',
            value: symbols.leafs.REACT_LIB,
          },
          new inquirer.Separator(),
          {
            name: 'Node.js App',
            value: symbols.leafs.NODE_APP,
          },
          {
            name: 'Node.js Library',
            value: symbols.leafs.NODE_LIB,
          },
          new inquirer.Separator(),
          {
            name: 'Lerna mono-repository with Dufl redirection',
            value: symbols.leafs.MONO_REPO_LERNA,
          },
          {
            name:
              'Dufl redirection (usefull when you work in a large mono-repository with multiple Dufl projects)',
            value: symbols.leafs.MONO_REPO_REDIRECTION,
          },
        ],
      },
    ];

    const answers = await inquirer.prompt(questions);
    const output = formatOutput(answers.name);
    const metadata = {
      outdent,
      symbols: symbols.commands,
      output,
      ...currentTool,
      ...answers,
    };

    console.log();

    let newPkgPath;

    if (fs.existsSync(paths.monorepo())) {
      newPkgPath = paths.monorepo(output);
    } else {
      newPkgPath = paths.resolver(output);
    }

    if (fs.existsSync(newPkgPath)) {
      console.log(
        red(`Package "${answers.name}" already exist ---> "${newPkgPath}"`),
      );

      process.exit(1);
    }

    const leaf = require(`./${answers.type}`);
    const leafExecuted = leaf(metadata) || {};

    for (let [path, value] of Object.entries(leafExecuted)) {
      const realPath = paths.resolver(newPkgPath, path);
      const dirPath = dirname(realPath);
      const isPkgJson =
        typeof value === 'object' && path.includes('package.json');

      if (isPkgJson) {
        const pkgJson = createPkgJson({
          ...metadata,
          config: value,
        });

        await writePkg(realPath, pkgJson, { normalize: false });

        continue;
      }

      if (!fs.existsSync(dirPath)) {
        await makeDir(dirPath);
      }

      fs.writeFileSync(realPath, value);
    }

    console.log(
      green(
        outdent`
          Package "${answers.name}" is now scaffolded in "${newPkgPath}". 
          
          - If you are in a mono-repository, you should run "lerna run bootstrap" command in the root of your mono-repository to install dependencies.

          - Otherwise, you should use "npm install".
        `,
      ),
    );

    console.log();

    process.exit();
  });

program.parse(process.argv);
