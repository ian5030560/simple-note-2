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
            FRONT_END: JSON.stringify("http://localhost:3000"),
            AI: JSON.stringify("wss://cf00-61-216-112-156.ngrok-free.app"),
            COLLAB: JSON.stringify("ws://localhost:3000")
        }),
    ],
    module: {
        rules: BASE_RULES()
    }
}

export default config;