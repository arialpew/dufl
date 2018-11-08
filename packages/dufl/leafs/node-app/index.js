'use strict';

const development = require('./webpack.config.dev');
const production = require('./webpack.config.prod');

module.exports = ({
  outdent,
  symbols: { WATCH, BUILD, TEST, ANALYZER, PKG },
}) => ({
  shouldPass: ({ bin }) => {
    if (!bin) {
      throw new Error(
        '"bin" field in "package.json" should not be empty when writing app.',
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
      description: 'Watch source for development (non-optimized build)',
      help: outdent`
        Some help
     `,
      webpack: development,
      env: 'development',
    },
    [BUILD]: {
      description:
        'Build source into production-ready bundle (optimized build)',
      help: outdent`
        Some help
      `,
      webpack: production,
      env: 'production',
    },
    [PKG]: {
      description:
        'Package bundle into x64 binaries (Windows/MacOS/Linux) with Node.js embedded',
      help: outdent`
        Some help
      `,
      env: 'production',
    },
    [ANALYZER]: {
      description: 'Analyze dependencies tree',
      help: outdent`
        Some help
      `,
      webpack: production,
      env: 'production',
    },
    [TEST]: {
      description: 'Start test suites',
      help: outdent`
        Some help
      `,
      env: 'test',
    },
  },
});
