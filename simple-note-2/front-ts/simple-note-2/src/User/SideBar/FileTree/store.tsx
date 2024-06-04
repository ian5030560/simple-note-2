import { TreeDataNode } from "antd"
import { create } from "zustand"

interface FileState {
    nodes: TreeDataNode[];
    add: (key: string, title: string, children: TreeDataNode[], root?: boolean) => void;
    delete: (key: string) => void;
    // direct: (key: string) => void;
}

function findTargetByKey(key: string, origin: TreeDataNode[]) {
    let [, indexes] = key.split("/");
    let indice = indexes ? indexes.split("-") : [];

    let tmp = origin;
    for (let i of indice) {
        if (!tmp[parseInt(i)].children) break;
        tmp = tmp[parseInt(i)].children!;
    }

    return tmp;
}

function getParentKey(key: string) {
    let [id, indice] = key.split("/");
    let indexes = indice.split("-").slice(0, -1);

    return id + "/" +
        (indexes.length === 0 ?
            indexes.reduce((prev, curr) => `${prev}-${curr}`, "") :
            indexes.reduce((prev, curr) => `${prev}-${curr}`)
        );
}

function changeSubtreeKey(t: TreeDataNode[], p: string) {

    for (let i = 0; i < t.length; i++) {
        let [id, index] = t[i].key.toString().split("/");
        let key = `${p}-${index}`;
        t[i].key = `${id}/${key}`;
        if (t[i].children) {
            changeSubtreeKey(t[i].children!, key);
        }
    }
}

const useStore = create<FileState>()((set) => ({
    nodes: [],
    feedback: "",
    add: (key, title, children) => set((state) => {
        let arr = state.nodes;
        let pkey = getParentKey(key);
        let target = findTargetByKey(pkey, arr);

        target.push({
            key: key,
            title: title,
            children: children,
        });

        return { nodes: [...state.nodes] }
    }),

    delete: (key) => set((state) => {
        const arr = state.nodes;
        let parent = getParentKey(key);
        let target = findTargetByKey(parent, arr);
        let i = parseInt(key.charAt(key.length - 1));
        target.splice(i, 1);

        changeSubtreeKey(target, parent.split("/")[1]);

        return { nodes: [...state.nodes] }
    }),

    // direct: (key) => set((state) => ({ ...state.nodes }))
}))

export default function useFiles(): [
    TreeDataNode[],
    (key: string, title: string, children: TreeDataNode[]) => void,
    (key: string) => void,
] {
    const store = useStore();

    return [store.nodes, store.add, store.delete]
}