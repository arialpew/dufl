#!/usr/bin/env node

'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs');
const outdent = require('outdent');
const program = require('caporal');
const { cyan, red } = require('chalk');
const { leafs, commands, versions } = require('dufl-symbols');
const { formatOutput, ensurePkgTypeIsValid } = require('dufl-utils');
const paths = require('dufl-utils/paths');
const dufl = require('dufl');

const getEnv = require('./get-env');

const { name, version, description } = require('./package');

const hasPkgJson = fs.existsSync(paths.appPackageJson);

if (!hasPkgJson) {
  console.log(
    red(`Package.json file is required in order to use "dufl-cli" ...`),
  );

  process.exit(1);
}

const availablePkgTypes = Object.values(leafs).join(', ');
const projectPkg = require(paths.appPackageJson);
const projectPkgDufl = projectPkg.dufl;

if (!projectPkgDufl) {
  console.log(
    red(
      outdent`
        When using "dufl-cli", you should have a "dufl" field in your "package.json".

        {
          ...
          "dufl": {}
        }

        You can make new project with "npx dufl-scaffold" :) ...

        Available package types : ${availablePkgTypes}
      `,
    ),
  );

  process.exit(1);
}

const projectPkgType = projectPkgDufl.type;

if (!projectPkgType) {
  console.log(
    red(
      outdent`
        When using "dufl-cli", you should have a "type" field (in "dufl" field) in your "package.json".

        {
          ...
          "dufl": {
            "type": "pkg-type"
          }
        }

        You can make new project with "npx dufl-scaffold" :) ...

        Available package types : ${availablePkgTypes}
      `,
    ),
  );

  process.exit(1);
}

if (!ensurePkgTypeIsValid(Object.values(leafs), projectPkgType)) {
  console.log(
    red(
      outdent`
        Package type "${projectPkgType}" is not valid.

        {
          ...
          "dufl": {
            "type": "${projectPkgType}"
          }
        }

        Available package types : ${availablePkgTypes}
      `,
    ),
  );

  process.exit(1);
}

const leaf = require(`dufl/leafs/${projectPkgType}`);

const help = outdent`
  Available package types : ${availablePkgTypes}
`;

const ref = program
  .name(name)
  .version(version)
  .description(description)
  .help(cyan(help));

const leafExecuted = leaf({
  outdent,
  commands,
});

const shouldPass = leafExecuted.shouldPass || (() => true);
const requiredFiles = leafExecuted.requiredFiles || [];
const leafCommands = leafExecuted.commands || {};

for (let [command, options] of Object.entries(leafCommands)) {
  const params = options.params || {};

  const subRef = ref
    .command(command, options.description || '')
    .help(options.help || '');

  for (let [param, config] of Object.entries(params)) {
    subRef.option(
      param,
      config.description,
      config.validator(program),
      config.default,
    );
  }

  subRef.action(() => {
    if (!options.env) {
      console.log(
        red(
          `Leaf "${projectPkgType}.${command}" need "env" property (production, development, test), custom env are not supported.`,
        ),
      );

      process.exit(1);
    }

    if (!dufl[command]) {
      console.log(
        red(
          `Leaf "${projectPkgType}" can't run "${command}" command, are you sure this command exist ?`,
        ),
      );

      process.exit(1);
    }

    try {
      shouldPass(projectPkg);
    } catch (err) {
      console.log(red(err.message));

      process.exit(1);
    }

    require(`./environments/${options.env}.js`);

    const output = formatOutput(projectPkg.name);
    const env = getEnv();

    // Assert this just to be safe.
    if (env.stringified['process.env'].NODE_ENV !== `"${options.env}"`) {
      console.log(
        red(`Command "${command}" must have NODE_ENV=${options.env}}.`),
      );

      process.exit(1);
    }

    dufl[command]({
      versions,
      projectPkg,
      output,
      paths,
      requiredFiles,
      env,
      options,
    });
  });
}

program.parse(process.argv);
