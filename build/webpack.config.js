const path = require('path')

module.exports = {
  mode: "production",
  entry: './index.js',
  output: {
    filename: 'venus-ui.js',
    path: path.resolve(__dirname, '../dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: [/node_modules/],
      },
      {
        test: /\.es6$/,
        loaders: ['babel-loader'],
      },
    ],
  },
};