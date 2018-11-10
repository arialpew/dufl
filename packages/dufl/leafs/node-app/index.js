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
        When you use "watch" command, we will watch source code and build when something changes.

        The build result is not optimized and minified, you should not use it in production.
        
        You can make production build with "build" command when you are done. 

        Be aware that you are working on a Node.js app, so you have to restart the application to get the changes applied.

        You can use "nodemon" in conjuction with this command if you want to restart your app automatically.
     `,
      webpack: development,
      env: 'development',
    },
    [BUILD]: {
      description:
        'Build source into production-ready bundle (optimized build)',
      help: outdent`
        When you use "build" command, we will build the application for production.

        Optimization are applied (constant folding, dead code elimination, ...) and we output minifed JavaScript code.

        After this step, you can package your Node.js application with "pkg" command ; it will build x64 binaries for Windows/MacOS/Linux.
      `,
      webpack: production,
      env: 'production',
    },
    [PKG]: {
      description:
        'Package bundle into x64 binaries (Windows/MacOS/Linux) with Node.js embedded',
      help: outdent`
        You can package your Node.js application with "pkg" command ; it will build x64 binaries for Windows/MacOS/Linux.

        We embedded Node.js v10 so the consumers don't have any dependencies or runtime needed, you can just share executable :) .

        You should use "build" command before "pkg" command, because we need production build to package your application.
      `,
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
        Tests are targeted when file path match "__tests__/*.spec.js".

        We use Jest (https://jestjs.io) so you can put any Jest option like "test -- --watchAll" :) .
      `,
      env: 'test',
      params: {
        '--watch': {
          description: 'Enable watch mode',
          default: false,
          validator: types => types.BOOL,
        },
      },
    },
  },
});
