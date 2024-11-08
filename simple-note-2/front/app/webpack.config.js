/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const DefinePlugin = require("webpack").DefinePlugin;

const TEST = /\.(ts|js)x?$/;

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        clean: true,
        publicPath: "/",
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
                    {
                        loader: 'babel-loader',
                        options: {
                            plugins: [require.resolve("react-refresh/babel")]
                        }
                    },
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
        }),
        new ReactRefreshPlugin(),
    ],
    devServer: {
        static: path.resolve(__dirname, "dist"),
        hot: 'only',
        open: true,
        port: 3000,
        historyApiFallback: true
    },
    cache: true,
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            exclude: /node_modules/,
            parallel: true,
            include: "src",
        })],
    }
};
