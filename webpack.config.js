var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'public/javascript');
var APP_DIR = path.resolve(__dirname, 'client');

var config = {
  entry: ['whatwg-fetch', APP_DIR + '/app.js'],
  output: {
    path: BUILD_DIR,
    filename: 'client.js'
  },
  plugins: [
      new webpack.DllReferencePlugin({
          context: path.join(__dirname, "client"),
          manifest: require("./public/vendor/javascript/vendor-manifest.json")
      }),
  ],
  module : {
    loaders : [
      {
        test : /\.js?/,
        include : APP_DIR,
        loader : 'babel',
        query: {
          cacheDirectory: true,
          presets: ["es2015", "react"]
        }
      }
    ]
  },
  cache: true
};

module.exports = config;
