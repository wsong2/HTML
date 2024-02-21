const path = require('path');
module.exports = {
  entry: './src/tab3.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(css)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'tabs.js',
    path: path.join(__dirname, '../restsvr/webcontents'),
  },
  mode: 'development'
};