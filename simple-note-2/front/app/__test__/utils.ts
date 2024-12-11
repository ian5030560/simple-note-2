import { randomUUID } from "node:crypto";
import useNoteManager, { NoteDataNode } from "../src/util/useNoteManager";
import { NoteObject, SimpleNote2IndexedDB } from "../src/util/store";

export const uuid = () => randomUUID().split("-").join("-");

export async function prepareNoteManager(data: { nodes: { one: NoteDataNode[], multiple: NoteDataNode[] } }) {
    useNoteManager.setState(prev => ({ ...prev, ...data }));
    const db = new SimpleNote2IndexedDB();

    const flatten = data.nodes.one.flat(Infinity);
    for (const node of flatten) {
        const obj: NoteObject = { id: node.key, content: null, uploaded: true };
        db.add(obj);
    }
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}