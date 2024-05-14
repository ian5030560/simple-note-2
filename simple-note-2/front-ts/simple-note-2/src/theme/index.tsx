import useSupply, { createSupply, useSupplier } from "../util/supply";

export type ThemeSeed = {
    colorLightPrimary: string;
    colorLightNeutral: string;
    colorDarkNeutral: string;
    colorDarkPrimary: string;
}
const ThemeSeedSupply = createSupply<ThemeSeed>();
export const useThemeSeed = () => useSupply(ThemeSeedSupply);
export default function ThemeProvider({ children }: { children: React.ReactNode }){
    const Supplier = useSupplier(ThemeSeedSupply);

    return <Supplier>
        {children}
    </Supplier>
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

export function switchTheme(dark: boolean, seed?: ThemeSeed) {
    return {
        token: {
            colorPrimary: seed ? dark ? seed.colorDarkPrimary : seed.colorLightPrimary : dark ? defaultSeed.colorDarkPrimary : defaultSeed.colorLightPrimary,
            colorBgBase: seed ? dark ? seed.colorDarkNeutral : seed.colorLightNeutral : dark ? defaultSeed.colorDarkNeutral : defaultSeed.colorLightNeutral,
        }
    }
}