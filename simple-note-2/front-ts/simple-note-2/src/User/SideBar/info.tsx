import { useCookies } from "react-cookie";
import useSupply, { createSupply, useSupplier } from "../../util/supply";
import { defaultSeed, testSeed } from "../../theme";

export type Info = {
    username: string;
    picture?: string;
    themes: {
        colorLightPrimary: string;
        colorLightNeutral: string;
        colorDarkPrimary: string;
        colorDarkNeutral: string;
        isUsing: boolean;
    }[]
}

const InfoSupply = createSupply<Info>();
export const useInfo = () => useSupply(InfoSupply);
export function InfoSupplier({ children }: { children: React.ReactNode }) {
    const [{ username }] = useCookies(["username"]);

    const Supplier = useSupplier(InfoSupply, {
        username: username,
        themes: [
            {
                isUsing: true,
                ...defaultSeed,
            },
            {
                isUsing: false,
                ...testSeed,
            }
        ],
    });

    return <Supplier>
        {children}
    </Supplier>
}