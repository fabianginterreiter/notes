var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        vendor: [path.join(__dirname, "client", "vendors.js")]
    },
    output: {
        path: path.join(__dirname, "public", "vendor", "javascript"),
        filename: "dll.[name].js",
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "public", "vendor", "javascript", "[name]-manifest.json"),
            name: "[name]",
            context: path.resolve(__dirname, "client")
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ],
    resolve: {
        root: path.resolve(__dirname, "client"),
        modulesDirectories: ["node_modules"]
    },

    module: {
        loaders: [{
            test: /\.json$/,
            loader: 'json'
        }]
    }
};