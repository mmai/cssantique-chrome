var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    devpanel: './src/devpanel',
    content: './src/content',
    devtools: './src/devtools',
    background: './src/background',
  },
  output: {
    path: path.resolve(__dirname, 'js/'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      { test: /.json/, loader: 'json-loader' },
      { test: /\.jsx?$/, loader: 'babel-loader', query: {
          presets: ['react', 'es2015', 'stage-2']
        }
      },
    ]
  },
  node: {
    fs: 'empty'
  }
}
