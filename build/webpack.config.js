const path = require('path')

module.exports = {
  mode: "production",
  entry: './index.js',
  output: {
    filename: 'venus-ui.js',
    path: path.resolve(__dirname, '../dist')
  }
};