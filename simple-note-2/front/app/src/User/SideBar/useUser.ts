import { create } from "zustand";
import { defaultSeed, ThemeSeed } from "../../util/theme";
import { Cookies } from "react-cookie";
import NoteIndexedDB from "./NoteTree/store";
import { Token } from "../../util/api";

type Theme = {
    id: string;
    name: string;
    data: ThemeSeed;
    using: boolean;
}

type UserState = {
    username?: string;
    picture?: string;
    themes: Theme[];
    dark: boolean;
};

type UserAction = {
    signIn: (username: string, token: Token) => void;
    signOut: () => Promise<undefined>;
    signUp: (token: { access: string, refresh: string }) => void;
    applyTheme: (id: string) => void;
    toggleDark: () => void;
};

const store = create<UserAction & UserState>((set) => ({
    dark: false,
    themes: [{
        id: "wefjowej", name: "預設",
        data: defaultSeed, using: true,
    }],
    signIn: (username, token) => {
        const cookies = new Cookies();
        cookies.set("username", username);
        cookies.set("token", token);
    },
    signOut: () => {
        const cookies = new Cookies();
        cookies.remove("username");
        cookies.remove("token");
        return new NoteIndexedDB().deleteAll();
    },
    signUp: (token: Token) => {
        new Cookies().set("token", token);
    },
    applyTheme: (id) => set(({ themes }) => {
        themes.forEach((_, index) => {
            const { id: themeId } = themes[index];
            themes[index].using = id === themeId;
        });
        return { themes: [...themes] };
    }),
    toggleDark: () => {

    }
}));

const useUser = store;
export default useUser;