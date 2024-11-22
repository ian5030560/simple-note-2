import { create } from "zustand";
import { ThemeSeed } from "../../util/theme";
import { Cookies } from "react-cookie";
import NoteIndexedDB from "./NoteTree/store";

type Theme = {
    name: string;
    data: ThemeSeed & {isUsing: boolean};
}

type UserState = { 
    username?: string;
    picture?: string;
    themes: Theme[];
};

export type Token = {access: string, refresh: string};

type UserAction = {
    signIn: (username: string, token: Token) => void;
    signOut: () => Promise<undefined>;
    signUp: (token: {access: string, refresh: string}) => void;
};

const store = create<UserAction & UserState>(() => ({
    themes: [],
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
}));

const useUser = store;
export default useUser;