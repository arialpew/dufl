'use strict';

module.exports = ({ currentToolName }) => ({
  'package.json': {
    header: {
      bin: {
        [currentToolName]: `./node_modules/.bin/${currentToolName}`,
      },
    },
  },
});
