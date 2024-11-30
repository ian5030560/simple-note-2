import { $getRoot, LexicalEditor, NodeKey } from "lexical";

function elementContains(posx: number, posy: number, element: HTMLElement, bound?: HTMLElement) {

    if (!element) return false;

    const { x, y, width, height } = element.getBoundingClientRect();
    const { marginBottom, marginTop } = window.getComputedStyle(element);
 
    const pstyle = window.getComputedStyle(bound ? bound : element.parentElement!);
    const offsetLeft = parseFloat(pstyle.paddingLeft);
    const offsetRight = parseFloat(pstyle.paddingRight);

    return posx >= x - offsetLeft &&
        posx <= x + width + offsetRight &&
        posy >= y - parseFloat(marginTop) &&
        posy <= y + height + parseFloat(marginBottom);
}

export function getBlockFromPoint(editor: LexicalEditor, posx: number, posy: number, bound?: HTMLElement) {
    const keys = editor.read(() => $getRoot().getChildrenKeys());
    let first = 0;
    let last = keys.length - 1;
    let key: NodeKey | null = null;
    while (first <= last) {
        const firstElement = editor.getElementByKey(keys[first])!;
        const lastElement = editor.getElementByKey(keys[last])!;

        const fResult = elementContains(posx, posy, firstElement, bound);
        const lResult = elementContains(posx, posy, lastElement, bound);

        if (fResult || lResult) {
            key = fResult ? keys[first] : keys[last];
            break;
        }
        first ++;
        last --;
    }

    return key;
}