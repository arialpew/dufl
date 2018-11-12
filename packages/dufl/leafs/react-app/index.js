'use strict';

const sharedTestParams = require('../shared-test-params');

const development = require('./webpack.config.dev');
const production = require('./webpack.config.prod');

module.exports = ({ outdent, commands: { DEV, BUILD, TEST, ANALYZER } }) => ({
  requiredFiles: paths => [
    paths.appSrc,
    paths.appPackageJson,
    paths.appIndexJs,
    paths.appPublic,
    paths.appHtml,
  ],
  commands: {
    [DEV]: {
      description:
        'Watch source and start server for development with live-reload (non-optimized build)',
      help: outdent`
        When you use "dev" command, we will watch source code, build when something changes, and start a local server with live-reload (http://localhost:3000).

        The build result is not optimized and minified, you should not use it in production.

        You can make production build with "build" command when you are done. 
     `,
      webpack: development,
      env: 'development',
    },
    [BUILD]: {
      description:
        'Build source into production-ready bundle (optimized build)',
      help: outdent`
        When you use "build" command, we will build the application for production.

        Optimization are applied (constant folding, dead code elimination, ...) and we output minifed JavaScript/CSS/HTML code.
      `,
      webpack: production,
      env: 'production',
    },
    [ANALYZER]: {
      description: 'Analyze dependencies tree',
      help: outdent`
        Sometimes, it's usefull to analyze dependencies tree of a package.

        You can use the "analyzer" command, it will start a local server and open your browser (http://localhost:8888).

        Go on your browser and you can see the entiere dependencies tree, search package, and more :) .
      `,
      webpack: production,
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
