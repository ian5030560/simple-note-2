import { LexicalNode } from "lexical";
import { useState, useEffect } from "react";

export function inside(x: number, y: number, element: HTMLElement) {
    const { x: ex, y: ey, width, height } = element.getBoundingClientRect();
    return x >= ex && x <= ex + width && y >= ey && y <= ey + height
}

export const useAnchor = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setAnchor(document.getElementById("editor-anchor"));
    }, []);

    return anchor;
}

export function $contains(parent: LexicalNode, child: LexicalNode) {
    return parent.is(child) || child.getParents().forEach(p => p === parent);
}