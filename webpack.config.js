const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const path = require("path");
const modeConfig = (env) => require(`./build-utils/webpack.${env}`)(env);
const presetConfig = require("./build-utils/loadPresets");

// JavaScript rule
const javascript = {
  test: /\.(js)$/,
  exclude: /(node_modules)/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: []
      },
    },
  ],
};

// Image rule
const image = {
  test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
  use: {
    loader: "url-loader",
    options: { limit: 10000 },
  },
};

// SVG rule
const svg = {
  test: /\.svg$/,
  use: [
    {
      loader: "svg-url-loader",
      options: { limit: 10000 },
    },
  ],
};

// Plugin to process HTML
const htmlPlugin = new HtmlWebpackPlugin({
  filename: "index.html",
  template: "build-utils/index.html",
});

const config = ({ mode, presets } = { mode: "production", presets: [] }) => {
  return webpackMerge(
    {
      mode,
      entry: {
        // main JS file
        app: "./src/js/index.js",
      },
      // use sourcemaps, 'source-map' specifically
      devtool: "source-map",
      // different loaders are responsible for different file types
      module: {
        rules: [javascript, image, svg],
      },
      output: {
        path: path.resolve(__dirname, "public", "dist"),
        filename: "[name].js",
      },
      plugins: [htmlPlugin, new webpack.ProgressPlugin()],
      resolve: {
        extensions: ['.js', '.jsx', '.scss']
      }
    },
    modeConfig(mode),
    presetConfig({ mode, presets })
  );
};

module.exports = config;
