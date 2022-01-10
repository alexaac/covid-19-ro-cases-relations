const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const modeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require('./build-utils/loadPresets');

// Plugin to process HTML
const htmlPlugin = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: '../build-utils/index.html',
});
const htmlPlugin_en = new HtmlWebpackPlugin({
  filename: 'en/index.html',
  template: '../build-utils/en/index.html',
});

const config = ({ mode, presets } = { mode: 'production', presets: [] }) => {
  return merge(
    {
      mode,

      resolve: {
        fallback: {
          path: false,
        },
      },

      context: path.join(__dirname, './src'),

      entry: {
        // main JS file
        app: './js/index.js',
      },

      target: 'node', // support native modules

      // use sourcemaps, 'source-map' specifically
      devtool: 'source-map',

      // different loaders are responsible for different file types
      module: {
        rules: [
          {
            test: /\.(png|jpe?g|gif|webp|svg|tiff|ico)(\?.*)?$/,
            type: 'asset/resource',
          },
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
          },
          {
            test: /\.(json|geojson)$/i,
            exclude: /(node_modules)/,
            loader: 'json-loader',
          },
        ],
      },

      target: 'web', // important! index.js does not work without it

      plugins: [htmlPlugin, htmlPlugin_en, new webpack.ProgressPlugin()],

      resolve: {
        extensions: ['.js', '*'],
        modules: [path.join(__dirname, 'node_modules')],
        fallback: {
          fs: false,
          path: require.resolve('path-browserify'),
        },
      },
    },

    modeConfig(mode),

    presetConfig({ mode, presets })
  );
};

module.exports = config;
