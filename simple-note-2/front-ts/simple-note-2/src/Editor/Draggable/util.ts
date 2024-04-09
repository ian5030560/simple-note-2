import { $getRoot, LexicalEditor } from "lexical";

function elementContains(posx: number, posy: number, element: HTMLElement) {

    if (!element) return false;

    let { x, y, width, height } = element.getBoundingClientRect();
    let { marginBottom, marginTop } = window.getComputedStyle(element);
    let pstyle = window.getComputedStyle(element.parentElement!);
    let offsetLeft = parseFloat(pstyle.paddingLeft);
    let offsetRight = parseFloat(pstyle.paddingRight);

    return posx >= x - offsetLeft &&
        posx <= x + width + offsetRight &&
        posy >= y - parseFloat(marginTop) &&
        posy <= y + height + parseFloat(marginBottom);
}

export function getBlockFromPoint(editor: LexicalEditor, posx: number, posy: number) {
    let keys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());
    let first = 0;
    let last = keys.length - 1;
    let mid: number;
    let elem: HTMLElement | null = null;
    while (first <= last) {
        mid = Math.floor((first + last) / 2);
        let firstElement = editor.getElementByKey(keys[first])!;
        let midElement = editor.getElementByKey(keys[mid])!;
        let lastElement = editor.getElementByKey(keys[last])!;

        let fResult = elementContains(posx, posy, firstElement);
        let mResult = elementContains(posx, posy, midElement);
        let lResult = elementContains(posx, posy, lastElement);

        if (fResult || mResult || lResult) {
            elem = fResult ? firstElement : mResult ? midElement : lastElement;
            break;
        }
        else {
            let midRect = midElement.getBoundingClientRect();
            if (midRect.top < posy) first = mid + 1;
            else last = mid - 1;
        }
    }

    return elem;
}