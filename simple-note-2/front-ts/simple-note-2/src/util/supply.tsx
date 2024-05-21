import { SetStateAction, createContext, Dispatch, Context, useContext, useState } from "react";
import { create } from "zustand";

// export function createSupply<T>(defaultValue?: T) {
//     return create((set) => ({
//         state: defaultValue,
//         setState: () => set(state => )
//     }));
// }
type Supply<T> = [Context<T | undefined>, Context<Dispatch<SetStateAction<T | undefined>>>];

export function createSupply<T>(): Supply<T> {
    return [
        createContext<T | undefined>(undefined),
        createContext<Dispatch<SetStateAction<T | undefined>>>(() => { })
    ]
}

export function useSupplier<T>(supply: Supply<T>, defaultValue?: T) {
    const ContextProvider = supply[0].Provider;
    const Dispatcher = supply[1].Provider;
    const [state, setState] = useState<T | undefined>(defaultValue);


    return (prop: { children: React.ReactNode }) => <ContextProvider value={state}>
        <Dispatcher value={setState}>
            {prop.children}
        </Dispatcher>
    </ContextProvider>
}
export default function useSupply<T>(supply: Supply<T>): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
    const context = useContext(supply[0]);
    const dispatcher = useContext(supply[1]);

    return [context, dispatcher];
}
