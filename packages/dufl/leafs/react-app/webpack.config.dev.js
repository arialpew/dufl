'use strict';

const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

const shouldUseSourceMap = false;

module.exports = ({ versions, paths, env, helpers: { css, eslint } }) => {
  // Webpack uses `publicPath` to determine where the app is being served from.
  // In development, we always serve from the root. This makes config easier.
  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
  const publicPath = '/';
  const publicUrl = '';

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
    require.resolve('style-loader'),
    ...css({ browsers: versions.BROWSERS, cssOptions, shouldUseSourceMap }),
  ];

  return {
    devtool: 'cheap-module-source-map',
    entry: [
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
      require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs,
    ],
    output: {
      pathinfo: true,
      // This does not produce a real file. It's just the virtual path that is
      // served by WebpackDevServer in development. This is the JS bundle
      // containing code from all our entry points, and the Webpack runtime.
      filename: 'static/js/bundle.js',
      chunkFilename: 'static/js/[name].chunk.js',
      // This is the URL that app is served from. We use "/" in development.
      publicPath,
    },
    optimization: {
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
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // Don't waste time on Gzipping the cache.
                cacheCompression: false,
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
                cacheCompression: false,
                // If an error happens in a package, it's possible to be
                // because it was compiled. Thus, we don't want the browser
                // debugger to show the original code. Instead, the code
                // being evaluated would be much more helpful.
                sourceMaps: false,
              },
            },
            {
              test: /\.css$/,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: shouldUseSourceMap,
              }),
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
      new DefinePlugin(enhancedEnv.stringified),
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appHtml,
      }),
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, enhancedEnv.raw),
      new HotModuleReplacementPlugin(),
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
