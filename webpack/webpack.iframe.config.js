const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = require('./webpack.base.config')({
  mode: 'production',
  entry: {
    'live-sdk': ['@babel/polyfill', './src/index.ts'],
    iframe: ['./iframe/main.js']
  },
  
  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(process.cwd(), 'iframe-build'),
    publicPath: process.env.NODE_ENV === 'development'? 'iframe-build/':'',
    library: 'live.js',
    libraryTarget: 'umd'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './iframe/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      inject: true,
    }),
  ],
});
