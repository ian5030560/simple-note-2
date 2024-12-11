import path from "path";
import { Configuration, DefinePlugin } from "webpack";
import { BASE_PLUGINS, BASE_RULES } from "./webpack.base";

const config: Configuration = {
    extends: path.resolve(__dirname, "webpack.base.ts"),
    mode: "production",
    plugins: [
        ...BASE_PLUGINS,
        new DefinePlugin({
            'process.env': JSON.stringify(process.env),
            BACK_END: JSON.stringify("https://cf00-61-216-112-156.ngrok-free.app"),
            FRONT_END: JSON.stringify("https://5ca5-2a09-bac5-d58a-323-00-50-ac.ngrok-free.app"),
            AI: JSON.stringify("ws://cf00-61-216-112-156.ngrok-free.app"),
            COLLAB: JSON.stringify("wss://5ca5-2a09-bac5-d58a-323-00-50-ac.ngrok-free.app")
        }),
    ],
    module: {
        rules: [
            ...BASE_RULES,
            {
                test: /\.(ts|js)x?$/,
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/,
                use: [
                    "thread-loader",
                    { loader: 'babel-loader' },
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
        ]
    }
}

export default config;