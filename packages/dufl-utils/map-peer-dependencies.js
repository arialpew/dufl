'use strict';

const fs = require('fs');
const escapeStringRegexp = require('escape-string-regexp');

const toJest = (paths, dependencies) =>
  dependencies.reduce(
    (prev, next) => ({
      ...prev,
      [`^${escapeStringRegexp(next)}$`]: paths.appNodeModulesPackage(next),
    }),
    {},
  );

const toWebpack = (paths, dependencies) =>
  dependencies.reduce(
    (prev, next) => ({
      ...prev,
      [next]: paths.appNodeModulesPackage(next),
    }),
    {},
  );

const map = paths => {
  const pkg = require(paths.appPackageJson);
  const [pkgNsSlash] = pkg.name.split('/');
  const [pkgNsCarret] = pkg.name.split('-');

  if (!pkgNsSlash && !pkgNsCarret) {
    throw new Error(`
      "${pkg.name}" is an ambigous package name.
      
      Please use name with carret separator or slash separator (ex: organization-pkg, @organization/pkg) and don't use ambigous name without separator.
    `);
  }

  const pkgNs = pkgNsSlash ? pkgNsSlash : pkgNsCarret;

  const internalDependencies = Object.keys(pkg.dependencies || {}).filter(
    dependency => dependency.includes(pkgNs),
  );

  const internalPeerDependencies = internalDependencies
    .reduce((prev, dependency) => {
      const dependencyPath = paths.appNodeModulesPackageJson(dependency);

      if (!fs.existsSync(dependencyPath)) {
        throw new Error(
          `You have "${dependency}" listed as dependency, but this dependency doesn't exist in your current "node_modules" folder.`,
        );
      }

      const dependencyPkg = require(dependencyPath);

      if (!dependencyPkg.peerDependencies) {
        return prev;
      }

      return [...prev, ...Object.keys(dependencyPkg.peerDependencies)];
    }, [])
    .filter(Boolean);

  const uniqueFlattenedInternalPeerDependencies = [
    ...new Set(internalPeerDependencies),
  ];

  return uniqueFlattenedInternalPeerDependencies;
};

module.exports = { map, toJest, toWebpack };
