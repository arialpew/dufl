'use strict';

const create = require('./create');

module.exports = (api, opts) =>
  create(api, { helpers: false, ...opts }, 'test');
