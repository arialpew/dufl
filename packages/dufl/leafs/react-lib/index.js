'use strict';

const development = require('./webpack.config.dev');
const production = require('./webpack.config.prod');

module.exports = ({ outdent, symbols: { WATCH, BUILD, TEST, ANALYZER } }) => ({
  shouldPass: ({ main }) => {
    if (!main) {
      throw new Error(
        '"main" field in "package.json" should not be empty when writing library.',
      );
    }
  },
  requiredFiles: paths => [
    paths.appSrc,
    paths.appPackageJson,
    paths.appIndexJs,
  ],
  commands: {
    [WATCH]: {
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
