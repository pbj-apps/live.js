const path = require('path');

module.exports = require('./webpack.base.config')({
  mode: 'production',
  entry: ['@babel/polyfill', './src/index.ts'],

  // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(process.cwd(), 'sdk-build'),
  },

  plugins: [
    // Minify and optimize the index.html
    /* eslint-disable consistent-return */
  ],
});
