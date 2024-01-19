import { Editor } from "slate";
/**
 * 
 * @param {string} key 
 * @param {(e: Event, editor: Editor) => void} handler 
 * @returns 
 */
export default function createHotKey(key, handler){
    return {
        key: key,
        handler: handler
    }
}