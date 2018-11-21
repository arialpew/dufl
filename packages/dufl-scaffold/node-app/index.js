'use strict';

module.exports = ({
  outdent,
  output,
  currentToolName,
  symbols: { WATCH, BUILD, TEST, ANALYZER, PKG },
}) => ({
  'package.json': {
    header: {
      bin: {
        [output]: `./build/${output}.js`,
      },
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
      [PKG]: `${currentToolName} ${PKG}`,
    },
  },
  '.gitignore': outdent`
    node_modules
    coverage
    bin
    build
    *.log
    *.lock
    .env
  `,
  'src/index.js': outdent`
    console.log('Hello World');
  `,
  'src/__tests__/index.spec.js': outdent`
    it('should pass', () => {
      expect(true).toEqual(true);
    });
  `,
  '.env': outdent`
    DUFL_CUSTOM_ENV_VAR=value
  `,
});
