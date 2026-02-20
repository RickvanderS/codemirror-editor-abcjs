const path = require('path');

module.exports = {
  mode: 'production',
  entry: '/src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'codemirror-editor-abcjs.js',
    library: {
      type: 'umd'
    },
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
