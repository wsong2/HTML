const path = require('path');
module.exports = {
  entry: {
	  bundle: path.join(__dirname, '/src/index.js'),
	  snd: path.join(__dirname, '/src/snd.js')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js'
  }
};