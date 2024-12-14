import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import { ConfigProvider, FloatButton, FloatButtonProps, ThemeConfig, theme as _theme } from "antd";
import { useContext, useState } from "react";
import { createContext } from "react";
import { SimpleNote2LocalStorage } from "./store";

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
    colorLightPrimary: "#EA0000	",
    colorLightNeutral: "#FCFCFC",
    colorDarkPrimary: "#FF7575",
    colorDarkNeutral: "#272727",
}

export default function theme(seed: ThemeSeed): (dark: boolean) => ThemeConfig {
    return (dark) => ({
        token: {
            colorPrimary: seed ? dark ? seed.colorDarkPrimary : seed.colorLightPrimary : undefined,
            colorBgBase: seed ? dark ? seed.colorDarkNeutral : seed.colorLightNeutral : undefined,
        },
        algorithm: dark ? _theme.darkAlgorithm : _theme.defaultAlgorithm
    })
}

export const defaultTheme = theme(defaultSeed);

export interface BulbButtonProp extends FloatButtonProps{
    dark?: boolean,
    onClick?: React.MouseEventHandler<HTMLElement>
}
export const BulbButton = ({dark, onClick, ...props}: BulbButtonProp) => {
    return <FloatButton {...props} icon={!dark ? <AlertFilled /> : <AlertOutlined />} onClick={onClick} />
}

type ThemeConfigContextType = {
    dark: boolean;
    setDark: React.Dispatch<React.SetStateAction<boolean>>;
}
const ThemeConfigContext = createContext<ThemeConfigContextType>({ dark: false, setDark: () => { } });
interface ThemeProviderProps extends React.PropsWithChildren {
    dark?: boolean;
    seed?: ThemeSeed;
}
export function OfficialThemeProvider(props: ThemeProviderProps) {
    const [dark, setDark] = useState(props.dark ?? false);

    return <ConfigProvider theme={theme(props.seed ?? defaultSeed)(dark)}>
        <ThemeConfigContext.Provider value={{ dark, setDark }}>
            {props.children}
        </ThemeConfigContext.Provider>
    </ConfigProvider>
}

const store = new SimpleNote2LocalStorage();
export function OfficialDarkButton() {
    const { dark, setDark } = useContext(ThemeConfigContext);

    return <BulbButton dark={dark} onClick={() => setDark(() => {
        const prev = store.getOfficialDark();
        store.setOfficialDark(!prev);
        return !prev;
    })} />
}