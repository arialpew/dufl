'use strict';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const build = require('./build');

module.exports = ({ options, ...rest }) => {
  const compose = (f, g) => (...args) => f(g(...args));

  const withAnalyzer = config => ({
    ...config,
    plugins: [...config.plugins, new BundleAnalyzerPlugin()],
  });

  return build({
    ...rest,
    options: {
      ...options,
      webpack: compose(
        withAnalyzer,
        options.webpack,
      ),
    },
  });
};
