import { createPortal } from "react-dom"
import { NodeKey } from "lexical";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";
import { autoUpdate, offset, Placement, useFloating, useTransitionStyles } from "@floating-ui/react";

export interface WithAnchorProps {
    anchor: HTMLElement | null;
}
interface ActionProps {
    nodeKey?: NodeKey | null;
    children: React.ReactNode;
    placement: Placement;
    open: boolean;
    anchor: HTMLElement | null;
    inner?: boolean;
    offset?: number;
}
export default function Action(props: ActionProps) {
    const [editor] = useLexicalComposerContext();
    const { refs, floatingStyles, context } = useFloating({
        open: props.open, strategy: "absolute", placement: props.placement,
        whileElementsMounted: autoUpdate,
        middleware: [offset(({ rects }) => {
            const { placement, inner, offset } = props;

            if (!inner) {
                return offset ?? 0;
            }
            else {
                if (placement.includes("top") || placement.includes("bottom")) {
                    return -(rects.floating.height + (offset ?? 0));
                }
                else {
                    return -(rects.floating.width + (offset ?? 0));
                }
            }
        }, [props.placement])]
    });

    const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
        initial: { opacity: 0 }, open: { opacity: 1 }, close: { opacity: 0 }
    });

    useEffect(() => {
        const reference = props.nodeKey ? editor.getElementByKey(props.nodeKey) : null;
        refs.setReference(reference);
    }, [editor, props.nodeKey, refs]);

    return createPortal(<>
        {
            isMounted && <div ref={refs.setFloating} style={floatingStyles}>
                <div style={transitionStyles}>
                    {props.children}
                </div>
            </div>
        }
    </>, props.anchor || document.body);
}