'use strict';

const toDestructurable = symbol => symbol.toUpperCase().replace('-', '_');

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

module.exports = {
  toDestructurable,
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
};
