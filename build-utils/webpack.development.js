const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// SCSS/CSS rule
const styles = [
  {
    test: /\.(sa|sc|c)ss$/,
    loader: [
      MiniCssExtractPlugin.loader,
      "css-loader?sourceMap",
      "sass-loader?sourceMap"
    ],
  }
];

module.exports = () => ({
  module: {
    rules: [...styles],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
});
