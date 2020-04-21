const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  context: resolve('test'),
  entry: './rendering/TestApp.js',
  output: {
    filename: 'bundle.js',
    path: resolve('build/'),
    publicPath: '/'
  },
  devServer: {
    port: 8888,
    historyApiFallback: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    alias: {
      jsonld: resolve('./node_modules/jsonld/dist/jsonld.js')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './rendering/index.html',
      inject: true,
      minify: true
    })
  ]
};
