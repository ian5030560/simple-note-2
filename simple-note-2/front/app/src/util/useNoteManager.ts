import { TreeDataNode } from "antd";
import { EditorState } from "lexical";
import { create } from "zustand";
import { NoteObject, NoteIndexedDB } from "./store";

export interface NoteDataNode extends TreeDataNode {
    key: string;
    title: string;
    children: NoteDataNode[];
    url?: string;
    parent: string | null;
}

export function findNode(nodes: NoteDataNode[], key: string): NoteDataNode | undefined {
    if (nodes.length === 0) {
        return undefined;
    }

    for (const node of nodes) {
        if (node.key === key) {
            return node;
        }

        const childNode = findNode(node.children, key);
        if (childNode) return childNode;
    }

    return undefined;
}

type NoteManagerState = {
    nodes: { one: NoteDataNode[], multiple: NoteDataNode[] };
}

type NoteManagerAction = {
    add: (data: { key: string, title: string, url?: string }, parent: string | null, type?: keyof NoteManagerState["nodes"]) => Promise<void>;
    remove: (key: string, type?: keyof NoteManagerState["nodes"]) => Promise<void>;
    update: (key: string, options: Partial<NoteDataNode>, type?: keyof NoteManagerState["nodes"]) => void;
    find: (key: string, type?: keyof NoteManagerState["nodes"]) => NoteDataNode | undefined;
    save: (key: string, content: EditorState) => Promise<void>;
}

export class NoteStorageError extends Error {
    constructor(message: string) {
        super(message);
    }
}

const createStore = create<NoteManagerState & NoteManagerAction>()((set, get) => ({
    nodes: { one: [], multiple: [] },

    add: async (data, parent, type) => {
        const note: NoteObject = { id: data.key, content: null, uploaded: true };
        const result = await new Promise((resolve, reject) => {
            if (type === "multiple") {
                resolve(data.key);
            }
            else {
                const db = new NoteIndexedDB();
                db.add(note).then(resolve).catch(() => reject(new NoteStorageError("Failed to store in IndexedDB")));
            }
        });

        if (!result) throw new NoteStorageError("Failed to store in IndexedDB");
        else {
            set(prev => {
                const nodes = prev.nodes[type || "one"];
                const nodeArr = !parent ? nodes : findNode(nodes, parent)?.children;
                if(!nodeArr) throw new NoteStorageError(`Can't find the Node-${parent}`);
                nodeArr.splice(nodeArr.length, 0, { ...data, children: [], parent: parent });

                return { nodes: { ...prev.nodes, [type || "one"]: [...nodes] } };
            });
        }
    },

    remove: async (key, type) => {
        const result = await new Promise<boolean>((resolve, reject) => {
            if (type === "multiple") {
                resolve(true);
            }
            else {
                const db = new NoteIndexedDB();
                db.delete(key).then((req) => resolve(req === undefined)).catch(reject);
            }
        });

        if(result){
            set((prev) => {
                const nodes = prev.nodes[type || "one"];
                const parent = findNode(nodes, key)?.parent;
                if(parent === undefined) throw new NoteStorageError(`Can't find the Node-${key}`);
                const nodeArr = !parent ? nodes : findNode(nodes, parent)!.children;
                const index = nodeArr.findIndex(it => it.key === key);
                nodeArr.splice(index, 1);
    
                return { nodes: { ...prev.nodes, [type || "one"]: [...nodes] } };
            })
        };
    },

    update: (key, options, type) => set((prev) => {
        const nodes = prev.nodes[type || "one"];
        const node = findNode(nodes, key);
        if (!node) throw new NoteStorageError(`Can't find the Node-${key}`);
        Object.assign(node, options);

        return { nodes: { ...prev.nodes, [type || "one"]: [...nodes] } };
    }),

    find: (key, type) => findNode(get().nodes[type || "one"], key),
    save: async (key, content) => {
        const node = findNode(get().nodes["one"], key);
        if(!node) throw new NoteStorageError(`Can't find the Node-${key}`);
        else{
            const db = new NoteIndexedDB();
            db.update({content: content.toJSON(), uploaded: false, id: key});
        }
    }
}));

const useNoteManager = createStore;
export default useNoteManager;