import { create } from "zustand";

type Context = {
    activate?: boolean
    room?: string
}

type Action = {
    active: (room: string) => void;
    close: () => void;
}
const useStore = create<Context & Action>()(set => ({
    activate: true,
    room: "test",
    active: (room: string) => set(() => ({activate: true, room: room})),
    close: () => set(() => ({activate: false, room: undefined}))
}))

export function useCollab(){
    return useStore();
}