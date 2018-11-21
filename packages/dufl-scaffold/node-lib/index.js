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
    coverage
    build
    *.log
    *.lock
    .env
  `,
  'src/add.js': outdent`
    export const add = (a, b) => a + b;
  `,
  'src/index.js': outdent`
    export * from './add';
  `,
  'src/__tests__/add.spec.js': outdent`
    import { add } from './add';

    it('should add numbers', () => {
      expect(add(1, 1)).toEqual(2);
    });
  `,
  '.env': outdent`
    DUFL_CUSTOM_ENV_VAR=value
  `,
});
