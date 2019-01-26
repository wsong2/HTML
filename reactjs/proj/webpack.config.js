const path = require('path');
const HWP = require('html-webpack-plugin');
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
  plugins:[
	new HWP(
		{template: path.join(__dirname,'/src/index.html')}
	)
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js'
  }
};