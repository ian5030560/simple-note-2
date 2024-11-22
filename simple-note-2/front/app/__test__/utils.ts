import { randomUUID } from "node:crypto";
import useNoteManager, { NoteDataNode } from "../src/User/SideBar/NoteTree/useNoteManager";
import NoteIndexedDB, { NoteObject } from "../src/User/SideBar/NoteTree/store";

export const uuid = () => randomUUID().split("-").join("-");

export async function prepareNoteManager(data: { nodes: { one: NoteDataNode[], multiple: NoteDataNode[] } }) {
    useNoteManager.setState(prev => ({ ...prev, ...data }));
    const db = new NoteIndexedDB();

    const flatten = data.nodes.one.flat(Infinity);
    for (const node of flatten) {
        const obj: NoteObject = { id: node.key, content: null, uploaded: true };
        db.add(obj);
    }
}

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}