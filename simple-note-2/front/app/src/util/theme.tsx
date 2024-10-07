import { ThemeConfig, theme as _theme } from "antd";

export type ThemeSeed = {
    colorLightPrimary: string;
    colorLightNeutral: string;
    colorDarkNeutral: string;
    colorDarkPrimary: string;
}

export const defaultSeed: ThemeSeed = {
    colorLightPrimary: "#8696A7",
    colorLightNeutral: "#FFFCEC",
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