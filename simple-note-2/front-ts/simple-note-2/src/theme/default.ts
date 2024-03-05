import { determineWhiteOrBlack } from "../util/color";
import { ThemeConfig } from "antd";

export type ThemeConfigHandler = (dark: boolean) => ThemeConfig;

const defaultTheme: ThemeConfigHandler = (dark: boolean) => {
    return {
        token: {
            colorPrimary: "#8696A7",
            // colorPrimary: "#87CEEB",
            colorBgBase: dark ? "#3C3C3C" : "#FFFCEC",
            // colorBgBase: dark ? "#3C3C3C" : "#f5f5f5",
        },
        components: {
            Menu: {
                itemBg: "#8696A7",
                // itemBg: "#87CEEB",
                itemColor: "#FFFFFF",
                itemHoverColor: "#FFFFFF",
                itemSelectedColor: "#FFFFFF",
                horizontalItemSelectedColor: "#FFFFFF",
            },

            Tree: {
                nodeSelectedBg: "#FFFFFF",
            }
        }
    }
}

export default defaultTheme