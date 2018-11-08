'use strict';

const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const shouldUseSourceMap = false;

module.exports = ({ paths, env, helpers: { css, eslint, terser } }) => {
  // Webpack uses `publicPath` to determine where the app is being served from.
  // It requires a trailing slash, or the file assets will get an incorrect path.
  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
  const publicPath = paths.servedPath;
  const publicUrl = publicPath.slice(0, -1);
  // Some apps do not use client-side routing with pushState.
  // For these, "homepage" can be set to "." to enable relative asset paths.
  const shouldUseRelativeAssetPaths = publicPath === './';

  const enhancedEnv = {
    ...env,
    raw: {
      ...env.raw,
      PUBLIC_URL: publicUrl,
    },
    stringified: {
      ...env.stringified,
      'process.env': {
        ...env.stringified['process.env'],
        PUBLIC_URL: JSON.stringify(publicUrl),
      },
    },
  };

  const getStyleLoaders = cssOptions => [
    {
      loader: MiniCssExtractPlugin.loader,
      options: Object.assign(
        {},
        shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined,
      ),
    },
    ...css({ cssOptions, shouldUseSourceMap }),
  ];

  return {
    bail: true,
    devtool: shouldUseSourceMap ? 'source-map' : false,
    entry: [paths.appIndexJs],
    output: {
      path: paths.appBuild,
      filename: 'static/js/[name].[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      publicPath,
    },
    optimization: {
      minimizer: [
        terser({ shouldUseSourceMap }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  // `inline: false` forces the sourcemap to be output into a
                  // separate file
                  inline: false,
                  // `annotation: true` appends the sourceMappingURL to the end of
                  // the css file, helping the browser find the sourcemap
                  annotation: true,
                }
              : false,
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: true,
    },
    module: {
      rules: [
        eslint({ appSrc: paths.appSrc }),
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.(js|mjs)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                customize: require.resolve(
                  'babel-preset-dufl/webpack-overrides',
                ),
                presets: [
                  [
                    require.resolve('babel-preset-dufl'),
                    { platform: 'web', emotion: true },
                  ],
                ],
                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-prettier,-svgo![path]',
                        },
                      },
                    },
                  ],
                ],
                babelrc: false,
                configFile: false,
                cacheDirectory: true,
                cacheCompression: true,
                compact: true,
              },
            },
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('babel-preset-dufl/dependencies'),
                    { helpers: true },
                  ],
                ],
                babelrc: false,
                configFile: false,
                compact: false,
                cacheDirectory: true,
                cacheCompression: true,
                sourceMaps: false,
              },
            },
            {
              test: /\.css$/,
              loader: getStyleLoaders({
                importLoaders: 1,
                sourceMap: shouldUseSourceMap,
              }),
              sideEffects: true,
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new DefinePlugin(enhancedEnv.stringified),
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, enhancedEnv.raw),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath,
      }),
    ],
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
