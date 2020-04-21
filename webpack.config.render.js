const path = require('path');

module.exports = {
  mode: 'development',
  context: path.resolve('test'),
  entry: './rendering/TestApp.js',
  output: {
    filename: './rendering/bundle.js',
    path: path.resolve(__dirname, 'test')
  },
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
      jsonld: path.resolve('./node_modules/jsonld/dist/jsonld.js')
    }
  }
};
