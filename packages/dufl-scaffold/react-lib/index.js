'use strict';

module.exports = ({
  outdent,
  output,
  currentToolName,
  symbols: { STYLEGUIDEV, STYLEGUIBUILD, WATCH, BUILD, TEST, ANALYZER },
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
      [STYLEGUIDEV]: `${currentToolName} ${STYLEGUIDEV}`,
      [STYLEGUIBUILD]: `${currentToolName} ${STYLEGUIBUILD}`,
      [WATCH]: `${currentToolName} ${WATCH}`,
      [BUILD]: `${currentToolName} ${BUILD}`,
      [TEST]: `${currentToolName} ${TEST}`,
      [ANALYZER]: `${currentToolName} ${ANALYZER}`,
    },
  },
  'src/index.js': outdent`
    export * from './Component';
  `,
  'src/Component.js': outdent`
    import React from 'react';

    export const Component = () => <div>{'Hello World'}</div>;
  `,
  'src/Component.md': outdent`
    Styleguide :

    \`\`\`jsx
    <Component />
    \`\`\`

    And you _can_ **use** any [Markdown](http://daringfireball.net/projects/markdown/) here.

    Fenced code blocks with "js", "jsx", or "javascript" languages are rendered as an interactive playgrounds :

    You can disable an editor by passing a "noeditor" modifier (js noeditor) :

    \`\`\`jsx noeditor
    <Component />
    \`\`\`

    To render an example as highlighted source code add a "static" modifier (js static) :

    \`\`\`js static
    import React from 'react';
    \`\`\`

    Fenced blocks with other languages are rendered as highlighted code :

    \`\`\`html
    <h1>Hello world</h1>
    \`\`\`
  `,
  'src/__tests__/Component.spec.js': outdent`
    import React from 'react';
    import ReactDOM from 'react-dom';

    import { Component } from '../Component';

    it('render without crashing', () => {
      const div = document.createElement('div');

      ReactDOM.render(<Component />, div);

      ReactDOM.unmountComponentAtNode(div);
    });
  `,
  '.gitignore': outdent`
    node_modules
    coverage
    build
    styleguide
    *.log
    *.lock
    .env
  `,
  '.env': outdent`
    DUFL_CUSTOM_ENV_VAR=value
  `,
});
