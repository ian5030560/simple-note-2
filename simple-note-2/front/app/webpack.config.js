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
        new DefinePlugin({
            'process.env': JSON.stringify(process.env),
            APIs: JSON.stringify({
                registerOrLogin: "http://localhost:8000/registerAndLogin/",
                forgetPassword: "http://localhost:8000/forgetPassword/",
                signOut: "http://localhost:8000/logout/",
                addFile: "http://localhost:8000/newMediaFile/",
                deleteFile: "http://localhost:8000/deleteFile/",
                getInfo: "http://localhost:8000/getInfo/",
                updateInfo: "http://localhost:8000/updateInfo/",
                getNote: "http://localhost:8000/getNote/",
                addNote: "http://localhost:8000/newNote/",
                deleteNote: "http://localhost:8000/deleteNote/",
                saveNote: "http://localhost:8000/saveNote/",
                addTheme: "http://localhost:8000/newTheme/",
                loadNoteTree: "http://localhost:8000/loadNoteTree/",
                addCollaborate: "http://localhost:8000/newCollaborate/",
                deleteCollaborate: "http://localhost:8000/deleteCollaborate/",
                joinCollaborate: "http://localhost:8000/joinCollaborate/",
                getNumber: "http://localhost:4000/room/number",
                getBreezeAI: "ws://localhost:8000/ws/ai/",
            })
        })
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
