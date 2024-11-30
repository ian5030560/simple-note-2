import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import { ConfigProvider, FloatButton, ThemeConfig, theme as _theme } from "antd";
import { useContext, useState } from "react";
import { createContext } from "react";

export type ThemeSeed = {
    colorLightPrimary: string;
    colorLightNeutral: string;
    colorDarkNeutral: string;
    colorDarkPrimary: string;
}

export const defaultSeed: ThemeSeed = {
    colorLightPrimary: "#8696A7",
    colorLightNeutral: "#FFFFFF",
    colorDarkPrimary: "#8696A7",
    colorDarkNeutral: "#3C3C3C",
}

export const testSeed: ThemeSeed = {
    colorLightPrimary: "red",
    colorLightNeutral: "white",
    colorDarkPrimary: "red",
    colorDarkNeutral: "black",
}

export default function theme(seed: ThemeSeed): (dark: boolean) => ThemeConfig{
    return (dark) => ({
        token: {
            colorPrimary: seed ? dark ? seed.colorDarkPrimary : seed.colorLightPrimary : undefined,
            colorBgBase: seed ? dark ? seed.colorDarkNeutral : seed.colorLightNeutral : undefined,
        },
        algorithm: dark ? _theme.darkAlgorithm : _theme.defaultAlgorithm
    })
}

export const defaultTheme = theme(defaultSeed);

export interface BulbButtonProp {
    dark?: boolean,
    onClick?: React.MouseEventHandler<HTMLElement>
}
export const BulbButton = (prop: BulbButtonProp) => {
    return <FloatButton icon={!prop.dark ? <AlertFilled /> : <AlertOutlined />} onClick={prop.onClick} />
}

type ThemeConfigContextType = {
    dark: boolean;
    setDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const ThemeConfigContext = createContext<ThemeConfigContextType>({dark: false, setDark: () => {}});
interface ThemeProviderProps extends React.PropsWithChildren{
    dark?: boolean;
    seed?: ThemeSeed;
}
export function ThemeProvider(props: ThemeProviderProps){
    const [dark, setDark] = useState(props.dark ?? false);

    return <ConfigProvider theme={theme(props.seed ?? defaultSeed)(dark)}>
        <ThemeConfigContext.Provider value={{dark, setDark}}>
            {props.children}
        </ThemeConfigContext.Provider>
    </ConfigProvider>
}

export const useThemeConfig = () => useContext(ThemeConfigContext);

export function ThemeSwitchButton(){
    const {dark, setDark} = useThemeConfig();

    return <BulbButton dark={dark} onClick={() => setDark(prev => !prev)}/>
}