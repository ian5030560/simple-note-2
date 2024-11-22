import { create } from "zustand";
import { ThemeSeed } from "../../util/theme";
import { Cookies } from "react-cookie";

type Theme = {
    name: string;
    data: ThemeSeed & {isUsing: boolean};
}

type UserState = { 
    username: string;
    picture?: string;
    themes: Theme[];
};
type UserAction = {
    signIn: (username: string) => void;
    signOut: () => void;
    signUp: (token: {access: string, refresh: string}) => void;
};

export type Token = {access: string, refresh: string};

const store = create<UserAction & UserState>(() => ({
    username: "",
    themes: [],
    signIn: (username) => {
        new Cookies().set("username", username);
        
    },
    signOut: () => {},
    signUp: (token: Token) => {
        new Cookies().set("token", token);
    },
}));

const useUser = store;
export default useUser;