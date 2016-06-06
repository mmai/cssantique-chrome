var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    devpanel: './src/devpanel',
    content: './src/content',
    devtools: './src/devtools',
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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    })
  ],
  node: {
    fs: 'empty'
  }
}
