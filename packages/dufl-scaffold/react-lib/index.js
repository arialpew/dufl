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
    devDependencies: {
      react: '^16.7.0-alpha.2',
      'react-dom': '^16.7.0-alpha.2',
    },
    peerDependencies: {
      react: '^16.7.0-alpha.2',
      'react-dom': '^16.7.0-alpha.2',
    },
    scripts: {
      [WATCH]: `${currentToolName} ${WATCH}`,
      [BUILD]: `${currentToolName} ${BUILD}`,
      [TEST]: `${currentToolName} ${TEST}`,
      [ANALYZER]: `${currentToolName} ${ANALYZER}`,
    },
  },
  'src/index.js': outdent`
    import Component from './Component';

    export { Component };
  `,
  'src/Component.js': outdent`
    import React from 'react';

    export default () => <div>{'Hello World'}</div>;
  `,
  'src/__tests__/Component.spec.js': outdent`
    import React from 'react';
    import ReactDOM from 'react-dom';

    import Component from '../Component';

    it('render without crashing', () => {
      const div = document.createElement('div');

      ReactDOM.render(<Component />, div);

      ReactDOM.unmountComponentAtNode(div);
    });
  `,
  '.gitignore': outdent`
    node_modules
    *.log
    .env
  `,
  '.env': outdent`
    DUFL_CUSTOM_ENV_VAR=value
  `,
});
