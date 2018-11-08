'use strict';

const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [[require.resolve('babel-preset-dufl'), { platform: 'node' }]],
  babelrc: false,
  configFile: false,
});
