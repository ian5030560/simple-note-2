import { TreeDataNode } from "antd"
import { create } from "zustand"

interface FileState {
    nodes: TreeDataNode[];
    feedback: string;
    add: (key: string, title: string, children: TreeDataNode[], root?: boolean) => void;
    delete: (key: string) => void;
    direct: (key: string) => void;
}

function findTargetByKey(key: string, origin: TreeDataNode[]) {
    let [root, ...indice] = key.split("-");

    let tmp = origin.find(org => org.key === root)?.children;
    if(!tmp) return origin;

    for (let i of indice.slice(1)) {
        if (!tmp[parseInt(i)].children) break;
        tmp = tmp[parseInt(i)].children!;
    }

    return tmp;
}

function getParentKey(key: string) {
    let indice = key.split("-");

    let result = indice[0]
    for (let i of indice.slice(1, -1)) {
        result = `${result}-${i}`
    }

    return result;
}

function changeSubtreeKey(t: TreeDataNode[], p: string) {

    for (let index in t) {
        let key = `${p}-${index}`;
        t[index].key = key;
        if (t[index].children) {
            changeSubtreeKey(t[index].children!, key);
        }
    }
}

const useStore = create<FileState>()((set) => ({
    nodes: [],
    feedback: "",
    add: (key, title, children, root) => set((state) => {
        let arr = state.nodes;
        let target = findTargetByKey(key, arr);
        
        let nodeKey = root ? key : `${key}-${target.length}`;
        target.push({
            key: nodeKey,
            title: title,
            children: children,
        });

        return {nodes: [...state.nodes], feedback: nodeKey}
    }),

    delete: (key) => set((state) => {
        const arr = state.nodes;
        let parent = getParentKey(key);
        let target = findTargetByKey(parent, arr);
        let i = parseInt(key.charAt(key.length - 1));
        target.splice(i, 1);

        changeSubtreeKey(target, parent);

        return {nodes: [...state.nodes], feedback: target.length === 0 ? parent : target[target.length - 1].key as string}
    }),

    direct: (key) => set((state) => ({...state.nodes, feedback: key}))
}))

export default function useFiles(): [
    TreeDataNode[],
    string,
    (key: string, title: string, children: TreeDataNode[], root?: boolean) => void,
    (key: string) => void,
    (key: string) => void,
]{
    const store = useStore();
    return [store.nodes, store.feedback, store.add, store.delete, store.direct]
}