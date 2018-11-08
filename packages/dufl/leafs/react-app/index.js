'use strict';

const development = require('./webpack.config.dev');
const production = require('./webpack.config.prod');

module.exports = ({ outdent, symbols: { DEV, BUILD, TEST, ANALYZER } }) => ({
  requiredFiles: paths => [
    paths.appSrc,
    paths.appPackageJson,
    paths.appIndexJs,
    paths.appPublic,
    paths.appHtml,
  ],
  commands: {
    [DEV]: {
      description: '',
      help: outdent`
        Some help
      `,
      webpack: development,
      env: 'development',
    },
    [BUILD]: {
      description: '',
      help: outdent`
        Some help
      `,
      webpack: production,
      env: 'production',
    },
    [ANALYZER]: {
      description: '',
      help: outdent`
        Some help
      `,
      webpack: production,
      env: 'production',
    },
    [TEST]: {
      description: '',
      help: outdent`
        Some help
      `,
      env: 'test',
    },
  },
});
