'use strict';

const validatePkgName = require('validate-npm-package-name');

const formatOutput = pkgName => pkgName.replace(/[/]/g, '-').replace(/@/g, '');

const isValidPkgName = pkgName => validatePkgName(pkgName).validForNewPackages;

const ensurePkgTypeIsValid = (types, projectType) => {
  const allowed = Object.values(types);
  const formated = allowed.join(', ');

  if (!allowed.some(type => type === projectType)) {
    return false;
  }

  return true;
};

const defaultPkgJsonOptions = {
  header: {},
  footer: {},
  scripts: {},
  devDependencies: {},
  dependencies: {},
  peerDependencies: {},
};

const createPkgJson = ({
  name,
  type,
  currentToolName,
  currentToolVersion,
  config: {
    header = defaultPkgJsonOptions.header,
    footer = defaultPkgJsonOptions.footer,
    scripts = defaultPkgJsonOptions.scripts,
    devDependencies = defaultPkgJsonOptions.devDependencies,
    dependencies = defaultPkgJsonOptions.dependencies,
    peerDependencies = defaultPkgJsonOptions.peerDependencies,
  } = defaultPkgJsonOptions,
}) => ({
  name,
  private: true,
  version: '0.0.1',
  description: 'Description',
  type,
  ...header,
  scripts: {
    ...scripts,
    [currentToolName]: currentToolName,
  },
  devDependencies: {
    [currentToolName]: `^${currentToolVersion}`,
    ...devDependencies,
  },
  dependencies,
  peerDependencies,
  ...footer,
});

module.exports = {
  formatOutput,
  isValidPkgName,
  ensurePkgTypeIsValid,
  createPkgJson,
};
