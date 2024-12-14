import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import path from "node:path";
import { Configuration, DefinePlugin } from "webpack";
import 'webpack-dev-server';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { BASE_PLUGINS, BASE_RULES } from "./webpack.base";

const config: Configuration = {
    extends: path.resolve(__dirname, "webpack.base.ts"),
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: path.resolve(__dirname, "dist"),
        hot: true,
        open: true,
        port: 3001,
        historyApiFallback: true
    },
    cache: true,
    watchOptions: {
        ignored: /node_modules/,
    },
    plugins: [
        ...BASE_PLUGINS,
        new DefinePlugin({
            'process.env': JSON.stringify(process.env),
            BACK_END: JSON.stringify("http://localhost:8000"),
            FRONT_END: JSON.stringify("https://b995-2a09-bac5-d58c-323-00-50-ac.ngrok-free.app"),
            AI: JSON.stringify("ws://cf00-61-216-112-156.ngrok-free.app"),
            COLLAB: JSON.stringify("ws://localhost:3000")
        }),
        new ReactRefreshWebpackPlugin(),
        new ForkTsCheckerWebpackPlugin(),
    ],
    module: {
        rules: BASE_RULES(true)
    }
}

export default config;