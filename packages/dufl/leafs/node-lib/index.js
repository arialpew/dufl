'use strict';

const sharedTestParams = require('../shared-test-params');

const webpack = require('./webpack.config');

module.exports = ({ outdent, commands: { WATCH, BUILD, TEST, ANALYZER } }) => ({
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
      description: 'Watch source for development (non-optimized build)',
      help: outdent`
        When you use "watch" command, we will watch source code and build when something changes.

        The build result is not optimized and minified, you should not use it in production.

        You can make production build with "build" command when you are done. 
     `,
      webpack,
      env: 'development',
    },
    [BUILD]: {
      description:
        'Build source into production-ready bundle (optimized build)',
      help: outdent`
        When you use "build" command, we will build the application for production.

        Optimization are applied (constant folding, dead code elimination, ...) and we output minifed JavaScript code.
      `,
      webpack,
      env: 'production',
    },
    [ANALYZER]: {
      description: 'Analyze dependencies tree',
      help: outdent`
        Sometimes, it's usefull to analyze dependencies tree of a package.

        You can use the "analyzer" command, it will start a local server and open your browser (http://localhost:8888).

        Go on your browser and you can see the entiere dependencies tree, search package, and more :) .
      `,
      webpack,
      env: 'production',
    },
    [TEST]: {
      description: 'Start test suites',
      help: outdent`
        Tests target files who are in "__tests__" folders, and files who have ".test.js" or ".spec.js" extension.

        We use Jest (https://jestjs.io) so you can put any Jest option like "test -- --watchAll" :) .
      `,
      env: 'test',
      params: sharedTestParams(outdent),
    },
  },
});
