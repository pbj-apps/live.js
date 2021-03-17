require('@babel/polyfill');
require('dotenv').config();
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  entry: {
    sdk: ['@babel/polyfill', './src/index.ts' ],
    iframe: path.resolve(process.cwd(), './iframe/main.js'),
    demo: path.resolve(process.cwd(), './demo-app/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'live.js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false
    })],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './iframe/index.html',
      chunks: ['sdk', 'iframe']
    }),
    new HtmlWebpackPlugin({ 
      filename: 'demo-app.html',
      template: './demo-app/index.html',
      chunks: ['sdk', 'demo']
    }),
    new Dotenv()
  ],
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env'],
          },
        },
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
        use: ['url-loader'],
      }
    ],
  }
};
