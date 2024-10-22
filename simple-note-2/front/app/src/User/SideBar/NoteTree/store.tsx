import { TreeDataNode } from "antd";
import { create } from "zustand";

export type NoteDataNode = Omit<TreeDataNode, 'children'> & { url?: string, children: NoteDataNode[] };
type FindResult = {
    parent: NoteDataNode | undefined,
    current: NoteDataNode,
    previous: NoteDataNode | undefined,
}
export function findNode(nodes: NoteDataNode[], key: string): FindResult | undefined {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.key === key) {
            return {
                parent: undefined,
                current: node,
                previous: nodes[i - 1]
            }
        }

        const index = node.children!.findIndex(it => it.key === key);
        if (index !== -1) {
            return {
                parent: node,
                current: node.children![index],
                previous: node.children![index - 1]
            }
        }

        const result = findNode(node.children!, key)
        if (result) return result

    }

    return undefined
}

type TreeState = {
    nodes: NoteDataNode[];
}

type AddOption = {
    children?: NoteDataNode[];
    parentKey?: string | null;
    siblingKey?: string | null;
    url?: string;
}
type TreeAction = {
    add: (key: string, title: string, option: AddOption) => void;
    remove: (key: string) => void;
    update: (key: string, options: Partial<NoteDataNode>) => void;
    findNode: (key: string) => FindResult | undefined;
}

const createStore = create<TreeState & TreeAction>()((set, get) => ({
    nodes: [
        {
            key: "one",
            children: [],
        },
        {
            key: "multiple",
            children: [],
        }
    ],
    add: (key, title, { children, parentKey, siblingKey, url }) => set((prev) => {
        let nodes = prev.nodes;
        if (parentKey) nodes = findNode(nodes, parentKey)!.current.children!;
        const index = siblingKey ? nodes.findIndex(it => it.key === siblingKey) + 1 : nodes.length;
        nodes.splice(index, 0, { key: key, title: title, children: children || [], url: url });

        return { ...prev };
    }),
    remove: (key) => set((prev) => {
        const nodes = prev.nodes;
        const parent = findNode(nodes, key)!.parent;
        const children = parent ? parent.children! : nodes;
        children?.splice(nodes.findIndex(it => it.key === key), 1);
        return { ...prev };
    }),

    update: (key, options) => set((prev) => {
        const nodes = prev.nodes;
        const node = findNode(nodes, key)?.current;
        if (!node) throw new Error("This node is not existed");
        Object.assign(node, options);

        return { ...prev };
    }),
    findNode: (key) => findNode(get().nodes, key)
}));

export const useNodes = createStore;