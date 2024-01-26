import { determineWhiteOrBlack } from "../util/color";
import { ThemeConfig } from "antd";

export type ThemeConfigHandler = (dark: boolean) => ThemeConfig;

const defaultTheme: ThemeConfigHandler = (dark: boolean) => {
    return {
        token: {
            colorPrimary: "#8696A7",
            colorBgBase: dark ? "#3C3C3C" : "#FFFCEC"
        },
        components: {
            Menu: {
                itemBg: "#8696A7",
                itemColor: determineWhiteOrBlack("#8696A7"),
                itemHoverColor: "#FFFFFF",
                horizontalItemSelectedColor: "#FFFFFF",
            },

            Tree: {
                nodeSelectedBg: "#FFFFFF"
            }
        }
    }
}

export default defaultTheme