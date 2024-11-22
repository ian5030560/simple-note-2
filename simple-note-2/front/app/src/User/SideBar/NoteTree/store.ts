import { SerializedEditorState } from "lexical";

export type NoteObject = {
    id: string;
    content: SerializedEditorState | null;
    uploaded: boolean;
};

export default class NoteIndexedDB {

    dbName = "simple-note-2-indexeddb";
    storeName = "Note";
    private request: Promise<IDBDatabase>;

    constructor() {
        const request = indexedDB.open(this.dbName, 1);

        this.request = new Promise((resolve, reject) => {
            request.onupgradeneeded = () => {
                const db = request.result;
                db.createObjectStore(this.storeName, { keyPath: "id" });
            }
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    private async getStore() {
        return (await this.request).transaction(this.storeName, "readwrite").objectStore(this.storeName);
    }

    update(note: NoteObject) {
        return this.promise(store => store.put(note));
    }

    get(id: string) {
        return this.promise(store => store.get(id));
    }

    add(note: NoteObject) {
        return this.promise(store => store.add(note));
    }

    delete(id: string) {
        return this.promise(store => store.delete(id));
    }

    deleteAll() {
        return this.promise(store => store.clear());
    }

    private promise<T>(callback: (store: IDBObjectStore) => IDBRequest<T>) {
        return new Promise<T>((resolve, reject) => {
            this.getStore().then(store => {
                const request = callback(store);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            })
        })
    }
}