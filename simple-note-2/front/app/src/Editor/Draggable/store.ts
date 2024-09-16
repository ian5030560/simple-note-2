import { create } from "zustand";

type DndState = {
    id?: string,
    element?: { x: number, y: number },
    line?: { x?: number, y?: number, width?: number, height?: number },
    dragging: boolean;
}

type DndAction = {
    setId: (id: string) => void,
    setElement: (x: number, y: number) => void,
    setLine: (payload: { x?: number, y?: number, width?: number, height?: number }) => void,
    reset: (type: keyof DndState) => void,
    setDragging: (value: boolean) => void,
}

const useStore = create<DndState & DndAction>()(set => ({
    dragging: false,
    setId: (id) => set(() => ({ id: id })),
    setElement: (x, y) => set(() => ({ element: { x: x, y: y } })),
    setLine: (payload) => set(() => ({ line: payload })),
    reset: (type) => set(() => ({ [type]: undefined })),
    setDragging: (value) => set(() => ({ dragging: value }))
}))

export default function useDnd(){
    return useStore();
}