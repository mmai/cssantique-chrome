var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    main: './src/main',
    content: './src/content',
    devtools: './src/devtools',
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
