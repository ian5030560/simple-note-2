
import { ThemeConfig } from "antd";

export type ThemeConfigHandler = (dark: boolean) => ThemeConfig;

const defaultTheme: ThemeConfigHandler = (dark: boolean) => {
    
    return {
        token: {
            colorPrimary: "#8696A7",
            // colorPrimary: "#87CEEB",
            colorBgBase: dark ? "#3C3C3C" : "#FFFCEC",
            // colorBgBase: dark ? "#3C3C3C" : "whitesmoke",
        },
    }
}

export default defaultTheme