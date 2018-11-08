'use strict';

module.exports = ({ appSrc }) => ({
  test: /\.(js|mjs)$/,
  enforce: 'pre',
  use: [
    {
      options: {
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
      },
      loader: require.resolve('eslint-loader'),
    },
  ],
  include: appSrc,
});
