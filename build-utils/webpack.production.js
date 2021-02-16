const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Plugin to compress our JS
const uglifyPlugin = new UglifyJSPlugin({
  uglifyOptions: { warnings: false },
});

// SCSS/CSS rule
const styles = [
  {
    test: /\.(sa|sc|c)ss$/,
    loader: [
      MiniCssExtractPlugin.loader,
      "css-loader",
      "sass-loader",
    ],
  },
];

module.exports = () => ({
  module: {
    rules: [...styles],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // filename: "[name].[hash].css",
      // chunkFilename: "[id].[hash].css",
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    uglifyPlugin,
  ],
});
