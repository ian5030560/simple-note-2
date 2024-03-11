import React, { createContext, useState } from "react";
import { ThemeConfigHandler } from "./default";

interface ThemeContextProp{
    theme: ThemeConfigHandler,
    themeSetter: React.Dispatch<ThemeConfigHandler>;
}
export const ThemeContext = createContext<ThemeContextProp | null>(null);

const ThemeProvider = ({children, defaultTheme}: {children: React.ReactNode, defaultTheme: ThemeConfigHandler}) => {

    const [theme, setTheme] = useState<ThemeConfigHandler>(() => defaultTheme);
    
    return <ThemeContext.Provider value={{theme: theme, themeSetter: setTheme}}>
        {children}
    </ThemeContext.Provider>
}

export default ThemeProvider;