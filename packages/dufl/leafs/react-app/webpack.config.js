'use strict';

const path = require('path');
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

const shouldUseSourceMap = false;

module.exports = ({
  versions,
  paths,
  alias,
  env,
  helpers: { css, eslint, terser },
}) => {
  const isProd = env.raw.NODE_ENV === 'production';
  const isDev = env.raw.NODE_ENV === 'development';
  const sourcemaps = {
    production: 'source-map',
    development: 'cheap-module-source-map',
  };
  const sourcemap = sourcemaps[env.raw.NODE_ENV];

  // Webpack uses `publicPath` to determine where the app is being served from.
  // In development, we always serve from the root. This makes config easier.
  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
  const publicPath = isProd ? paths.servedPath : '/';
  const publicUrl = isProd ? publicPath.slice(0, -1) : '';

  // This is for development only.
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

  const getStyleLoaders = cssOptions =>
    [
      isProd && {
        loader: MiniCssExtractPlugin.loader,
        options: Object.assign(
          {},
          shouldUseRelativeAssetPaths ? { publicPath: '../../' } : undefined,
        ),
      },
      isDev && require.resolve('style-loader'),
      ...css({ browsers: versions.BROWSERS, cssOptions, shouldUseSourceMap }),
    ].filter(Boolean);

  return {
    performance: false,
    mode: env.raw.NODE_ENV,
    bail: isProd,
    devtool: shouldUseSourceMap ? sourcemap : false,
    entry: [
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
      isDev && require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs,
    ].filter(Boolean),
    output: {
      pathinfo: isDev,
      filename: isDev
        ? 'static/js/bundle.js'
        : 'static/js/[name].[chunkhash:8].js',
      chunkFilename: isDev
        ? 'static/js/[name].chunk.js'
        : 'static/js/[name].[chunkhash:8].chunk.js',
      // This is the URL that app is served from. We use "/" in development.
      publicPath,
      // Point sourcemap entries to original disk location (format as URL on Windows).
      devtoolModuleFilenameTemplate: isProd
        ? info =>
            path
              .relative(paths.appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : isDev &&
          (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      path: isProd ? paths.appBuild : undefined,
    },
    optimization: {
      minimize: isProd,
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
    resolve: {
      alias,
      plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])],
      extensions: ['.mjs', '.js', '.json'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
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
                cacheCompression: isProd,
                compact: isProd,
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
                cacheDirectory: true,
                cacheCompression: isProd,
                compact: false,
                sourceMaps: false,
              },
            },
            {
              test: /\.css$/,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: shouldUseSourceMap,
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true,
            },
            {
              exclude: [/\.(js|mjs)$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new ModuleNotFoundPlugin(paths.appPath),
      new CaseSensitivePathsPlugin(),
      new DefinePlugin(enhancedEnv.stringified),
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
        minify: isProd
          ? {
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
            }
          : {},
      }),
      isProd &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, enhancedEnv.raw),
      isDev && new HotModuleReplacementPlugin(),
      new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath,
      }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
    ].filter(Boolean),
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
