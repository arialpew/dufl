const analyzer = require('./analyzer');
const build = require('./build');
const dev = require('./dev');
const pkg = require('./pkg');
const test = require('./test');
const watch = require('./watch');
const styleguibuild = require('./styleguibuild');
const styleguidev = require('./styleguidev');

module.exports = {
  build,
  dev,
  pkg,
  test,
  watch,
  analyzer,
  styleguibuild,
  styleguidev,
};
