import { TreeDataNode } from "antd";
import { EditorState } from "lexical";
import { create } from "zustand";

export interface NoteDataNode extends TreeDataNode {
    key: string;
    title: string;
    children: NoteDataNode[];
    url?: string;
    parent: string | null;
}

export type NoteObject = {
    id: string;
    content: any | null;
    uploaded: boolean;
};

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


function openSimpleNote2IndexedDB(): Promise<IDBDatabase> {
    const request = indexedDB.open("simple-note-2-indexeddb", 1);

    return new Promise((resolve, reject) => {
        request.onupgradeneeded = () => {
            const db = request.result;
            const store = db.createObjectStore("Note", { keyPath: "id" });
            store.createIndex("id", "id", {unique: true});
            store.createIndex("content", "content", {unique: false});
            store.createIndex("uploaded", "uploaded", {unique: false});
        }
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    })
}

export async function getNoteStore() {
    const transaction = await openSimpleNote2IndexedDB().then((db) => db.transaction("Note", "readwrite"));
    return transaction.objectStore("Note");
}

export async function operate<T>(requestFn: () => Promise<IDBRequest<T>>){
    const request = await requestFn();
    return new Promise<T>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
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
                getNoteStore().then(Note => {
                    const request = Note.add(note);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(new NoteStorageError("Failed to store in IndexedDB"));
                });
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
        const result = await new Promise((resolve, reject) => {
            if (type === "multiple") {
                resolve(true);
            }
            else {
                getNoteStore().then(Note => {
                    const request = Note.delete(key);
                    request.onsuccess = () => resolve(true);
                    request.onerror = () => reject(request.error);
                });
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
            const Note = await getNoteStore();
            await new Promise((resolve, reject) => {
                const request = Note.put({content: content.toJSON(), uploaded: false, id: key});
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
    }
}));

const useNoteManager = createStore;
export default useNoteManager;