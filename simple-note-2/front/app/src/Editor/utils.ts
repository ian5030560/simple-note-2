import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Klass, LexicalNode } from "lexical";
import { useEffect } from "react";

export function inside(x: number, y: number, element: HTMLElement) {
  const { x: ex, y: ey, width, height } = element.getBoundingClientRect();
  return x >= ex && x <= ex + width && y >= ey && y <= ey + height
}

export function $contains(parent: LexicalNode, child: LexicalNode) {
  return parent.is(child) || child.getParents().forEach(p => p === parent);
}

export function useValidateNodeClasses(nodeClasses: Klass<LexicalNode>[]) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    nodeClasses.forEach(nodeClass => {
      if (!editor.hasNode(nodeClass)) {
        throw new Error(`${nodeClass.getType()} is missing`);
      }
    })
  }, [editor, nodeClasses]);
}