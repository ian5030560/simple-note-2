import { create } from "zustand";

type Context = {
    room?: string
}

type Action = {
    active: (room: string) => void;
    close: () => void;
}
const useStore = create<Context & Action>()(set => ({
    active: (room: string) => set(() => ({room: room})),
    close: () => set(() => ({room: undefined}))
}))

export function useCollab(){
    return useStore();
}