const path = require('path');

module.exports = {
 entry: {
	index: './src/index',
	main: './src/main.js'
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
        use: ['css-loader']
      }
    ]
 },
 output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js'
 }
};