'use strict';

const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    content: './src/content.js',
    background: './src/background.js',
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        enforce: "pre",
        use: ["source-map-loader"],
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'app'),
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "../client/dist/client" },
        { from: "./static" },
      ],
    }),
  ],
};