import { LexicalNode } from "lexical";
import { create } from "zustand";

type MenuFocusedStore = {
    node: LexicalNode | null;
    setNode: (node: LexicalNode | null) => void;
}
const useStore = create<MenuFocusedStore>()(set => ({
    node: null,
    setNode: (node) => set(() => ({node}))
}))

export default function useMenuFocused(){
    return useStore();
}