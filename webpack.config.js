var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    main: './src/main',
  },
  output: {
    path: path.resolve(__dirname, 'js/'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /.js/, loader: 'babel-loader' },
      { test: /.json/, loader: 'json-loader' },
    ]
  },
  node: {
    fs: 'empty'
  }
}
