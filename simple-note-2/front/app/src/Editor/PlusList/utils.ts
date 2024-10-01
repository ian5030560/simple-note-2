import { $isBlockElementNode, $getSelection, ElementNode } from "lexical";
import { $findMatchingParent } from "@lexical/utils";

export function $isBlockSelected(node: ElementNode){
    if(!$isBlockElementNode(node)) throw new Error("this node is not block element");
    
    let flag = false;
    const selection = $getSelection();
    if(selection){
        const selectNodes = selection.getNodes();
        selectNodes.forEach(n => {
            const parent = $isBlockElementNode(n) ? n : $findMatchingParent(n, p => $isBlockElementNode(p));
            if(parent?.is(node)) flag = true;
        });
    }

    return flag;
    
}