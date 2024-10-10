import { TreeDataNode } from "antd";
import { createContext, useCallback, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { useShallow } from 'zustand/react/shallow'

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

type TreeAction = {
    add: (key: string, title: string, children: NoteDataNode[], parentKey: string | null, siblingKey: string | null, url?: string) => void;
    remove: (key: string) => void;
    update: (key: string, options: Partial<NoteDataNode>) => void;
    findNode: (key: string) => FindResult | undefined;
}

type TreeProps = TreeState

const createTreeStore = (props: TreeProps) => {
    
    return createStore<TreeState & TreeAction>()((set, get) => ({
        nodes: props.nodes,
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
        
        update: (key, options) => set(({ nodes }) => {
            const node = findNode(nodes, key)?.current;
            if (!node) throw new Error("This node is not existed");
            Object.assign(node, options);

            return { nodes: [...nodes] };
        }),
        findNode: (key) => findNode(get().nodes, key)
    }))
}

const TreeContext = createContext<ReturnType<typeof createTreeStore> | null>(null);

export function TreeProvider(props: React.PropsWithChildren<TreeProps>){
    const store = useRef(createTreeStore({nodes: props.nodes}));

    return <TreeContext.Provider value={store.current}>
        {props.children}
    </TreeContext.Provider>
}

export function useNodes(){
    const context = useContext(TreeContext);
    if(!context) throw new Error("Missing TreeProvider");
    
    return useStore(context, useShallow(state => state));
}