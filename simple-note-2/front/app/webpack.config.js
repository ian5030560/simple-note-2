/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const os = require("os");

const TEST = /\.(ts|js)x?$/;

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: TEST,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                use: [
                    "thread-loader",
                    'babel-loader',
                    {
                        loader: "ts-loader",
                        options: {
                            happyPackMode: true
                        }
                    }
                ],
            },
            {
                test: /\.css$/i,
                exclude: /\.module\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    "css-loader"
                ],
                sideEffects: true
            },
            {
                test: /\.module\.css$/,
                use: [
                    'style-loader',
                    "thread-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                auto: true,
                                localIdentName: '[name]_[local]_[hash:base64:5]',
                                namedExport: false,
                            },
                            import: true,
                        }
                    },
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public", "index.html"),
            favicon: path.resolve(__dirname, "public", "notesbook.png")
        }),
        new MiniCssExtractPlugin({
            filename: "css/[file].css"
        })
    ],
    devServer: {
        static: path.resolve(__dirname, "dist"),
        hot: true,
        open: true,
        port: 3000,
        historyApiFallback: true
    },
    cache: true,
    optimization: {
        splitChunks: {
            chunks: 'async', 
            minSize: 20000, 
            minRemainingSize: 0,
            minChunks: 1, 
            maxAsyncRequests: 30, 
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10, 
                    reuseExistingChunk: true,
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
            },
        },
    },
};
