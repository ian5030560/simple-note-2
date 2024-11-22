import { SerializedEditorState } from "lexical";

export type NoteObject = {
    id: string;
    content: SerializedEditorState | null;
    uploaded: boolean;
};

export default class NoteIndexedDB{

    dbName = "simple-note-2-indexeddb";
    storeName = "Note";
    private request: Promise<IDBDatabase>;

    constructor(){
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

    private async getStore(){
        return (await this.request).transaction(this.storeName, "readwrite").objectStore(this.storeName);
    }
    
    update(note: NoteObject){
        return new Promise<IDBValidKey>((resolve, reject) => {
            this.getStore().then(store => {
                const request = store.put(note);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            })
        });
    }

    get(id: string){
        return new Promise<NoteObject | undefined>((resolve, reject) => {
            this.getStore().then(store => {
                const request = store.get(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            })
        });
    }

    add(note: NoteObject){
        return new Promise<IDBValidKey>((resolve, reject) => {
            this.getStore().then(store => {
                const request = store.add(note);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            })
        });
    }

    delete(id: string){
        return new Promise<undefined>((resolve, reject) => {
            this.getStore().then(store => {
                const request = store.delete(id);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            })
        });
    }
}