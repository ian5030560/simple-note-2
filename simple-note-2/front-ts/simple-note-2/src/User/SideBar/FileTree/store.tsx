import { TreeDataNode } from "antd"
import { create } from "zustand"

interface FileState {
    nodes: TreeDataNode[];
    add: (key: string, title: string, children: TreeDataNode[]) => void;
    delete: (key: string) => void;
}


function findTargetByKey(key: string, origin: TreeDataNode[]) {
    let indice = key.split("-");

    let tmp = origin;
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
    nodes: [{key: "individual", title: "我的筆記", children: []}],
    add: (key, title, children) => set((state) => {
        let arr = state.nodes[0].children!;
        let target = findTargetByKey(key, arr);

        let nodeKey = `${key}-${target.length}`;
        target.push({
            key: nodeKey,
            title: title,
            children: children,
        });
        return {nodes: [...state.nodes]}
    }),

    delete: (key) => set((state) => {
        const arr = state.nodes[0].children!;
        let parent = getParentKey(key);
        let target = findTargetByKey(parent, arr);
        let i = parseInt(key.charAt(key.length - 1));
        target.splice(i, 1);

        changeSubtreeKey(target, parent);

        return {nodes: [...state.nodes]}
    }) 
}))

export default function useFileStore(): [
    TreeDataNode[],
    (key: string, title: string, children: TreeDataNode[]) => void,
    (key: string) => void,
]{
    const nodes = useStore(state => state.nodes);
    const add = useStore(state => state.add);
    const remove = useStore(state => state.delete);

    return [nodes, add, remove]
}