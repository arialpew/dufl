'use strict';

module.exports = ({
  outdent,
  output,
  currentToolName,
  symbols: { WATCH, BUILD, TEST, ANALYZER },
}) => ({
  'package.json': {
    header: {
      main: `./build/${output}.js`,
      sideEffects: false,
    },
    footer: {
      eslintConfig: {
        extends: 'react-app',
      },
    },
    scripts: {
      [WATCH]: `${currentToolName} ${WATCH}`,
      [BUILD]: `${currentToolName} ${BUILD}`,
      [TEST]: `${currentToolName} ${TEST}`,
      [ANALYZER]: `${currentToolName} ${ANALYZER}`,
    },
  },
  '.gitignore': outdent`
    node_modules
    *.log
    .env
  `,
  'src/index.js': outdent`
    export default () => 'Hello World';
  `,
  'src/__tests__/index.spec.js': outdent`
    import lib from '../';

    it('should return "Hello World"', () => {
      expect(lib()).toEqual('Hello World');
    });
  `,
  '.env': outdent`
    DUFL_CUSTOM_ENV_VAR=value
  `,
});
