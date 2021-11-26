const path = require('path');

module.exports = {
 entry: {
	tab3: './src/tab3'
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
    path: path.join(__dirname, '../../restsvr/webcontents'),
    filename: '[name].js'
 }
};