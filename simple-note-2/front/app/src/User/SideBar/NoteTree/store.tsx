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
    nodes: { one: NoteDataNode[], multiple: NoteDataNode[] };
}

type AddOption = {
    children?: NoteDataNode[];
    parentKey?: string | null;
    siblingKey?: string | null;
    url?: string;
}
type TreeAction = {
    add: (key: string, title: string, option: AddOption, type?: keyof TreeState["nodes"]) => void;
    remove: (key: string, type?: keyof TreeState["nodes"]) => void;
    update: (key: string, options: Partial<NoteDataNode>, type?: keyof TreeState["nodes"]) => void;
    findNode: (key: string, type?: keyof TreeState["nodes"]) => FindResult | undefined;
}

const createStore = create<TreeState & TreeAction>()((set, get) => ({
    nodes: { one: [], multiple: [] },

    add: (key, title, { children, parentKey, siblingKey, url }, type) => set((prev) => {
        const nodes = prev.nodes[type || "one"];
        let tmp = nodes;
        if (parentKey) tmp = findNode(tmp, parentKey)!.current.children!;
        const index = siblingKey ? tmp.findIndex(it => it.key === siblingKey) + 1 : tmp.length;
        tmp.splice(index, 0, { key: key, title: title, children: children || [], url: url });

        return { nodes: { ...prev.nodes, [type || "one"]: [...nodes] } };
    }),

    remove: (key, type) => set((prev) => {
        const nodes = prev.nodes[type || "one"];
        const parent = findNode(nodes, key)!.parent;
        const children = parent ? parent.children! : nodes;
        children?.splice(nodes.findIndex(it => it.key === key), 1);

        return { nodes: { ...prev.nodes, [type || "one"]: [...nodes] } };
    }),

    update: (key, options, type) => set((prev) => {
        const nodes = prev.nodes[type || "one"];
        const node = findNode(nodes, key)?.current;
        if (!node) throw new Error("This node is not existed");
        Object.assign(node, options);

        return { nodes: { ...prev.nodes, [type || "one"]: [...nodes] } };
    }),
    findNode: (key, type) => findNode(get().nodes[type || "one"], key)
}));

export const useNodes = createStore;