import { Configuration, RuleSetRule } from "webpack";
import path from "path";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
// const ReactRefreshTypeScript = require('react-refresh-typescript');

export const BASE_PLUGINS = [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public", "index.html"),
        favicon: path.resolve(__dirname, "public", "notesbook.png")
    }),
    new MiniCssExtractPlugin({
        filename: "css/[file].css"
    }),
];

export const BASE_RULES: (dev?: boolean) => RuleSetRule[] = (dev) => ([
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
        test: /\.(png|jpe?g|gif|mp4|svg)$/i,
        loader: "file-loader",
        options: {
            name: '[path][name].[ext]',
        },
    },
    {
        test: /\.(ts|js)x?$/,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: [
            "thread-loader",
            {
                loader: 'babel-loader',
                options: dev ? {
                    plugins: [require.resolve("react-refresh/babel")]
                } : undefined
            },
            {
                loader: "ts-loader",
                options: {
                    happyPackMode: true,
                    configFile: "tsconfig.json",
                    // getCustomTransformers: () => ({
                    //     before: ReactRefreshTypeScript()
                    // }),
                    // transpileOnly: true,
                }
            }
        ],
    },
]);

const config: Configuration = {
    entry: path.resolve(__dirname, "src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "../server", "dist"),
        filename: "bundle.js",
        clean: true,
        publicPath: "/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            exclude: /node_modules/,
            parallel: true,
            include: "src",
        })],
    },
};

export default config;