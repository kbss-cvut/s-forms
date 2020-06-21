const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  context: resolve('test'),
  entry: ['core-js/stable/object/assign', 'core-js/stable/promise', './rendering/TestApp.jsx'],
  output: {
    filename: 'bundle.js',
    path: resolve('build/'),
    publicPath: '/'
  },
  devServer: {
    host: '0.0.0.0',
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
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './rendering/index.html',
      inject: true,
      minify: true
    })
  ]
};
