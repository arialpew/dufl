'use strict';

module.exports = () => ({
  shouldPass: () => true,
  requiredFiles: paths => [paths.appPackageJson],
  commands: {},
});
