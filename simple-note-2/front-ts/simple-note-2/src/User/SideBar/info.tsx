import {create} from "zustand";
import {ThemeSeed} from "../../theme";

type Theme = {
    name: string;
    data: ThemeSeed & {isUsing: boolean};
}
interface InfoState{
    picture: string;
    themes: Theme[]
}

interface InfoAction{
    updatePicture: (picture: string) => void;
    updateThemeUsage: (index: number) => void;
    updateThemes: (themes: Theme[]) => void;
}

const useStore = create<InfoState & InfoAction>()((set) => ({
    picture: "",
    themes: [],

    updatePicture: (picture) => set(() => ({picture: picture})),

    updateThemeUsage: (index) => set((state) => {
        state.themes.forEach((theme, i) => {
            theme.data.isUsing = index === i;
        })

        return {themes: [...state.themes]}
    }),

    updateThemes: (themes) => set((state) => ({themes: themes}))
}))


export function useInfoContext(){
    const picture = useStore(state => state.picture);
    const themes = useStore(state => state.themes);

    return {picture, themes}
}

export function useInfoAction(){
    const updatePicture = useStore(state => state.updatePicture);
    const updateThemes = useStore(state => state.updateThemes);
    const updateThemeUsage = useStore(state => state.updateThemeUsage);

    return {updatePicture, updateThemes, updateThemeUsage}
}

// export type Info = {
//     username: string;
//     picture?: string;
//     themes: {
//         colorLightPrimary: string;
//         colorLightNeutral: string;
//         colorDarkPrimary: string;
//         colorDarkNeutral: string;
//         isUsing: boolean;
//     }[]
// }

// const InfoSupply = createSupply<Info>();
// export const useInfo = () => useSupply(InfoSupply);
// export function InfoSupplier({ children }: { children: React.ReactNode }) {
//     const [{ username }] = useCookies(["username"]);

//     const Supplier = useSupplier(InfoSupply, {
//         username: username,
//         themes: [
//             {
//                 isUsing: true,
//                 ...defaultSeed,
//             },
//             {
//                 isUsing: false,
//                 ...testSeed,
//             }
//         ],
//     });

//     return <Supplier>
//         {children}
//     </Supplier>
// }