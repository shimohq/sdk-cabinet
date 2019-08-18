'use strict'

const path = require('path')

module.exports = {
  entry: {
    cabinet: './src/index.ts',
    document: './src/document.ts',
    sheet: './src/sheet.ts',
    slide: './src/slide.ts',
    'document-pro': './src/document-pro.ts'
  },
  devtool: 'source-map',
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ShimoCabinet',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\/vendor\/shimo-jssdk\/shimo\.sdk\..*\.js$/i,
        use: 'script-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]
  }
}
