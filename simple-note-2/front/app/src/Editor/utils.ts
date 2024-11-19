import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Klass, LexicalNode } from "lexical";
import { useCallback, useEffect, useState } from "react";

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

export function mergeRefs<T>(
  ...inputRefs: (React.Ref<T> | undefined)[]
): React.Ref<T> | React.RefCallback<T> {
  const filteredInputRefs = inputRefs.filter(Boolean);

  if (filteredInputRefs.length <= 1) {
    const firstRef = filteredInputRefs[0];

    return firstRef || null;
  }

  return function mergedRefs(ref) {
    for (const inputRef of filteredInputRefs) {
      if (typeof inputRef === 'function') {
        inputRef(ref);
      } else if (inputRef) {
        (inputRef as React.MutableRefObject<T | null>).current = ref;
      }
    }
  };
}