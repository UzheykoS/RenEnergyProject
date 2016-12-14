/// <binding ProjectOpened='Watch - Development' /> 
"use strict";
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var webpack = require('webpack');

module.exports = {
    entry: "./Scripts/App.tsx",
    output: {
        path: "dist",
        filename: "bundle.js"
    },
    devtool: "cheap-module-source-map",
    resolve: {
        extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules|bower_components)/,
                loaders: ["ts-loader"]
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ title: "RenEnergyApp" }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || '"production"')
        })
    ]
};