const path = require('path')

module.exports = {
  entry: './index.ts',
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ShimoCabinet',
    libraryTarget: 'var'
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader'
    }]
  },
  resolve: {
    extensions: [
      '.ts'
    ]
  }
}
