'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (...args) =>
  path.resolve(...[appDirectory, ...args.filter(Boolean)]);

const envPublicUrl = process.env.PUBLIC_URL;

const ensureSlash = (inputPath, needsSlash) => {
  const hasSlash = inputPath.endsWith('/');

  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  } else {
    return inputPath;
  }
};

const getServedPath = () => {
  const servedUrl = envPublicUrl ? url.parse(envPublicUrl).pathname : '/';

  return ensureSlash(servedUrl, true);
};

module.exports = {
  resolver: resolveApp,
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  testsSetup: resolveApp('src/setup/test.js'),
  proxySetup: resolveApp('src/setup/proxy.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: envPublicUrl,
  servedPath: getServedPath(),
  appNodeModulesPackage: pkg => resolveApp(`node_modules/${pkg}`),
  appNodeModulesPackageJson: pkg =>
    resolveApp(`node_modules/${pkg}/package.json`),
  monorepo: (pkg = undefined) => resolveApp('packages', pkg),
};
