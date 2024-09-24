import { TreeDataNode } from "antd";
import { useCallback } from "react";
import { create } from "zustand";

export type NoteDataNode = Omit<TreeDataNode, 'children'> & { url?: string, children: NoteDataNode[] };
type FindResult = {
    parent: NoteDataNode | undefined,
    current: NoteDataNode,
    previous: NoteDataNode | undefined,
}
function findNode(nodes: NoteDataNode[], key: string): FindResult | undefined {
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

function travesal(nodes: NoteDataNode[], fn: (node: NoteDataNode) => void){
    for(let node of nodes){
        fn(node);
        travesal(node.children, fn);
    }
}

type TreeState = {
    nodes: NoteDataNode[];
}
type TreeAction = {
    add: (key: string, title: string, children: NoteDataNode[], parentKey: string | null, siblingKey: string | null, url?: string) => void;
    remove: (key: string) => void;
    init: (nodes: { key: string, title: string, children: NoteDataNode[], parentKey: string | null, siblingKey: string | null, url?: string }[]) => void;
    update: (key: string, options: Partial<NoteDataNode>) => void;
}
const useStore = create<TreeState & TreeAction>()(set => ({
    nodes: [],
    add: (key, title, children, parentKey, siblingKey, url) => set((prev) => {
        let nodes = prev.nodes;
        if (parentKey) nodes = findNode(prev.nodes, parentKey)!.current.children!;
        const index = siblingKey ? nodes.findIndex(it => it.key === siblingKey) + 1 : nodes.length;
        nodes.splice(index, 0, { key: key, title: title, children: children, url: url });

        return { nodes: [...prev.nodes] };
    }),
    remove: (key) => set((prev) => {
        const parent = findNode(prev.nodes, key)!.parent;
        const nodes = parent ? parent.children! : prev.nodes;
        nodes?.splice(nodes.findIndex(it => it.key === key), 1);
        return { nodes: [...prev.nodes] };
    }),

    init: (nodes) => set(() => {
        const newNodes: NoteDataNode[] = [];
        for (const node of nodes) {
            let children = newNodes;
            if (node.parentKey) children = findNode(newNodes, node.parentKey)!.current.children!;
            const index = node.siblingKey ? nodes.findIndex(it => it.key === node.siblingKey) + 1 : nodes.length;
            children.splice(index, 0, { key: node.key, title: node.title, children: [], url: node.url });
        }
        return { nodes: newNodes }
    }),

    update: (key, options) => set(({ nodes }) => {
        const node = findNode(nodes, key)?.current;
        if (!node) throw ("This node is not existed");
        Object.assign(node, options);

        return { nodes: [...nodes] };
    })
}))
 
export default function useNodes() {
    const store = useStore();

    const _findNode = useCallback((key: string) => findNode(store.nodes, key), [store.nodes]);
    const _travesal = useCallback((fn: (node: NoteDataNode) => void) => travesal(store.nodes, fn), [store.nodes]);

    return { ...store, findNode: _findNode, travesal: _travesal };
}