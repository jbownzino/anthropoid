// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

// avoid destructuring for older Node version support
const resolve = require('path').resolve;
const webpack = require('webpack');
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const CONFIG = {
    entry: {
        app: resolve('./src/app.js')
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "./bundle.js"
    },

    devtool: 'source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "./assets/[hash].[ext]",
                    },
                },
            },
            {
                test: /\.html$/,
                use: [
                    {
                     loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    resolve: {
        alias: {
            // From mapbox-gl-js README. Required for non-browserify bundlers (e.g. webpack):
            'mapbox-gl$': resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
        }
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        })
    ]

    // Optional: Enables reading mapbox token from environment variable
    //plugins: [new webpack.EnvironmentPlugin(['MapboxAccessToken'])]
};

// This line enables bundling against src in this repo rather than installed deck.gl module
module.exports = env => (env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG);
