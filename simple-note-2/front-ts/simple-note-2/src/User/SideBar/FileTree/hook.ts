import { TreeDataNode } from "antd";
import { create } from "zustand";

type FindResult = {
    parent: TreeDataNode | undefined,
    current: TreeDataNode,
    previous: TreeDataNode | undefined,
}
export function findNode(nodes: TreeDataNode[], key: string): FindResult | undefined{
    for(let i = 0; i < nodes.length; i ++){
        let node = nodes[i];
        if(node.key === key){
            return {
                parent: undefined,
                current: node,
                previous: nodes[i - 1]
            }
        }

        let index = node.children!.findIndex(it => it.key === key);
        if(index !== -1){
            return {
                parent: node,
                current: node.children![index],
                previous: node.children![index - 1]
            }
        }

        let result = findNode(node.children!, key)
        if(result) return result

    }

    return undefined
}

type TreeState = {
    nodes: TreeDataNode[];
}
type TreeAction = {
    add: (key: string, title: string, children: TreeDataNode[], parentKey: string | null, siblingKey: string | null) => void;
    remove: (key: string) => void;
}
const useStore = create<TreeState & TreeAction>()(set => ({
    nodes: [],
    add: (key, title, children, parentKey, siblingKey) => set((prev) => {
        let nodes = prev.nodes;
        if(parentKey) nodes = findNode(prev.nodes, parentKey)!.current.children!;
        let index = siblingKey ? nodes.findIndex(it => it.key === siblingKey) + 1 : nodes.length;
        nodes.splice(index, 0, { key: key, title: title, children: children });

        return { nodes: [...prev.nodes] };
    }),
    remove: (key) => set((prev) => {
        let parent = findNode(prev.nodes, key)!.parent;
        let nodes = parent ? parent.children! : prev.nodes;
        nodes?.splice(nodes.findIndex(it => it.key === key), 1);
        return { nodes: [...prev.nodes] };
    })
}))

export default function useFiles(): [TreeState["nodes"], TreeAction["add"], TreeAction["remove"]] {
    const store = useStore();

    return [store.nodes, store.add, store.remove];
}