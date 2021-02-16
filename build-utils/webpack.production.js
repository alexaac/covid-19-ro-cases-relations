const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

// Plugin to compress our JS
const uglifyPlugin = new UglifyJSPlugin({
  uglifyOptions: { warnings: false },
});

module.exports = () => ({
  output: {
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [uglifyPlugin, new MiniCssExtractPlugin()],
});
