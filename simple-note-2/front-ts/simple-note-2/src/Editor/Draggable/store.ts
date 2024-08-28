import { create } from "zustand";

type DndState = {
    id?: string,
    element?: { x: number, y: number },
    line?: { x?: number, y?: number, width?: number, height?: number },
}

type DndAction = {
    setId: (id: string) => void,
    setElement: (x: number, y: number) => void,
    setLine: (payload: {x?: number, y?: number, width?: number, height?: number}) => void,
    reset: (type: keyof DndState) => void,
}

const useStore = create<DndState & DndAction>()(set => ({
    setId: (id) => set(() => ({id: id})),
    setElement: (x, y) => set(() => ({element: {x: x, y: y}})),
    setLine: (payload) => set(() => ({line: payload})),
    reset: (type) => set(() => ({[type]: undefined})),
}))

export function useDndState(){
    const {id, element, line} = useStore();
    return {id, element, line}
}

export function useDndAction(){
    const {setElement, setId, setLine, reset} = useStore();
    return {setId, setElement, setLine, reset}
}