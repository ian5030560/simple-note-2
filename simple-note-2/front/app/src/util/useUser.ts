import { create } from "zustand";
import { defaultSeed, ThemeSeed } from "./theme";
import { Cookies } from "react-cookie";
import { NoteIndexedDB, ThemeLocalStorage } from "./store";
import { Token } from "./api";

export class Password{

    private _content = "";

    set content(value: string){
        this._content = value;
    }

    async compare(target: string){
        const encoded = await this.encode(target);
        return encoded === this._content;
    }

    async encode(target: string){
        const encoder = new TextEncoder();
        const data = encoder.encode(target);
        const hash = await window.crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        return hashHex;
    }
}
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
    password: Password;
};

type UserAction = {
    signIn: (username: string) => void;
    signOut: () => Promise<undefined>;
    signUp: (token: { access: string, refresh: string }) => void;
    applyTheme: (id: string) => void;
    toggleDark: () => void;
    deleteTheme: (id: string) => void;
};

export const DEFAULT_THEME_ID = "defaultTheme";
export const defaultThemeData = {
    id: DEFAULT_THEME_ID, name: "預設",
    data: defaultSeed, using: true,
}
const store = create<UserAction & UserState>((set) => ({
    dark: false,
    password: new Password(),
    themes: [],
    signIn: (username) => {
        const cookies = new Cookies();
        cookies.set("username", username);
    },
    signOut: () => {
        const cookies = new Cookies();
        cookies.remove("username", {path: "/"});
        cookies.remove("token", {path: "/"});
        return new NoteIndexedDB().deleteAll();
    },
    signUp: (token: Token) => {
        new Cookies().set("token", token);
    },
    applyTheme: (id) => set(({ themes }) => {
        themes.forEach((_, index) => {
            const { id: themeId } = themes[index];
            themes[index].using = id === (themeId + "");
        });
        return { themes: [...themes] };
    }),
    toggleDark: () => {
        const store = new ThemeLocalStorage();
        const prev = store.getUserDark();
        store.setOfficialDark(!prev);
        set({ dark: !prev });
    },
    deleteTheme: (id) => set(({ themes }) => {
        const deleted = themes.filter(it => (it.id + "") !== id);

        const index = deleted.findIndex(it => it.using);
        if (index === -1) deleted.map(it => ({ ...it, using: it.id === DEFAULT_THEME_ID }));

        return { themes: [...deleted] };
    })
}));

const useUser = store;
export default useUser;