const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  mode: 'development',

  output: {
    path: path.resolve(__dirname, '../dist'),
    assetModuleFilename: 'img/[name][ext]',

    libraryTarget: 'var',
    library: 'Client',
  },

  devtool: 'inline-source-map',

  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },

    static: {
      directory: path.join(__dirname, 'dist'),
    },

    port: 8008,
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({
      // Simulate the removal of files
      dry: true,
      // Write Logs to Console
      verbose: true,
      // Automatically remove all unused webpack assets on rebuild
      cleanStaleWebpackAssets: true,
      protectWebpackAssets: false,
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
});
