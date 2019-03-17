const path = require('path');

module.exports = {
  entry: {
	  bundle: path.join(__dirname, '/src/bundle.js'),
	  index: path.join(__dirname, '/src/index.js')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js'
  }
};