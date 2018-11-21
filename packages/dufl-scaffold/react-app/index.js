'use strict';

module.exports = ({
  outdent,
  currentToolName,
  symbols: { DEV, BUILD, TEST, ANALYZER },
}) => ({
  'package.json': {
    footer: {
      eslintConfig: {
        extends: 'react-app',
      },
    },
    dependencies: {
      react: '^16.7.0-alpha.2',
      'react-dom': '^16.7.0-alpha.2',
    },
    scripts: {
      [DEV]: `${currentToolName} ${DEV}`,
      [BUILD]: `${currentToolName} ${BUILD}`,
      [TEST]: `${currentToolName} ${TEST}`,
      [ANALYZER]: `${currentToolName} ${ANALYZER}`,
    },
  },
  'src/index.js': outdent`
    import React from 'react';
    import { render } from 'react-dom';

    import './index.css';

    import Component from './Component';

    render(
      <Component />,
      document.getElementById('root'),
    );
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
  'src/index.css': outdent`
    html, body {
      height: 100%;
    }

    body {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      background: linear-gradient(180deg, #202028 0, #0f0e15);
      color: #fff;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  `,
  'public/index.html': outdent`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
        <title>React App</title>
      </head>
      <body>
        <noscript>
          You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
      </body>
    </html>
  `,
  'public/manifest.json': outdent`
    {
      "short_name": "React App",
      "name": "React App Sample",
      "icons": [],
      "start_url": ".",
      "display": "standalone",
      "theme_color": "#000000",
      "background_color": "#ffffff"
    }
  `,
  '.gitignore': outdent`
    node_modules
    coverage
    build
    *.log
    *.lock
    .env
  `,
  '.env': outdent`
    DUFL_CUSTOM_ENV_VAR=value
  `,
});
