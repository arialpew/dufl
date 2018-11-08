'use strict';

module.exports = ({ cssOptions, shouldUseSourceMap }) => [
  {
    loader: require.resolve('css-loader'),
    options: cssOptions,
  },
  {
    // Options for PostCSS as we reference these options twice
    // Adds vendor prefixing based on your specified browser support in
    // package.json
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3,
          browsers:
            'last 2 Chrome version, last 1 Edge version, last 1 Firefox version, last 1 Safari version, last 1 and_chr version, last 1 ios_saf version',
        }),
      ],
      sourceMap: shouldUseSourceMap,
    },
  },
];
