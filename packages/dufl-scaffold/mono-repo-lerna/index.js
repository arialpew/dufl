'use strict';

module.exports = ({ currentToolName, outdent }) => ({
  'package.json': outdent`
    {
      "scripts": {
        "build": "lerna run build",
        "test": "lerna run test",
        "pkg": "lerna run pkg",
        "clean": "learn clean",
        "bootstrap": "lerna bootstrap",
        "format": "prettier --write 'packages/*/*.*' 'packages/*/!(node_modules|build|bin|coverage)/**/*.*'"
      },
      "devDependencies": {
        "lerna": "^3.4.3",
        "prettier": "^1.15.1"
      }
    }
  `,
  '.gitignore': outdent`
    node_modules
    packages/**/package.json.lerna_backup
    *.log
    .env
  `,
  '.editorconfig': outdent`
    root = true

    [*]
    charset = utf-8
    indent_style = space
    indent_size = 2
    end_of_line = lf
    insert_final_newline = true
    trim_trailing_whitespace = true
  `,
  '.prettierignore': outdent`
    *.lock
    *.log
    package-lock.json
    .env
  `,
  '.prettierrc': outdent`
    {
      "printWidth": 80,
      "tabWidth": 2,
      "useTabs": false,
      "semi": true,
      "singleQuote": true,
      "trailingComma": "all",
      "bracketSpacing": true,
      "jsxBracketSameLine": false
    }
  `,
  'lerna.json': outdent`
    {
      "packages": [
        "packages/*"
      ],
      "version": "0.0.0"
    }
  `,
  'packages/dev-utils/package.json': {
    header: {
      bin: {
        [currentToolName]: `./node_modules/.bin/${currentToolName}`,
      },
    },
  },
});
