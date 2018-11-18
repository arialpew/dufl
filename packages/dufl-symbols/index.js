'use strict';

const MONO_REPO_LERNA = 'mono-repo-lerna';
const MONO_REPO_REDIRECTION = 'mono-repo-redirection';
const NODE_APP = 'node-app';
const NODE_LIB = 'node-lib';
const REACT_APP = 'react-app';
const REACT_LIB = 'react-lib';

const ANALYZER = 'analyzer';
const BUILD = 'build';
const DEV = 'dev';
const PKG = 'pkg';
const TEST = 'test';
const WATCH = 'watch';

const NODE = 10;
const BROWSERS = [
  'last 2 Chrome version',
  'last 1 Edge version',
  'last 1 Firefox version',
  'last 1 Safari version',
  'last 1 and_chr version',
  'last 1 ios_saf version',
].join(', ');

module.exports = {
  commands: {
    ANALYZER,
    BUILD,
    DEV,
    PKG,
    TEST,
    WATCH,
  },
  leafs: {
    MONO_REPO_LERNA,
    MONO_REPO_REDIRECTION,
    NODE_APP,
    NODE_LIB,
    REACT_APP,
    REACT_LIB,
  },
  versions: {
    NODE,
    BROWSERS,
  },
};
