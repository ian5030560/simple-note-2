import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import Action, { WithAnchorProps } from "../../ui/action";
import { useValidateNodeClasses } from "../../utils";
import MathNode, { $isMathNode } from "../../nodes/math";
import { useCallback, useEffect, useRef, useState } from "react";
import { $getNodeByKey, NodeKey } from "lexical";
import { Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

type MathActionPluginProps = WithAnchorProps;
export default function MathActionPlugin(props: MathActionPluginProps) {
    const [editor] = useLexicalComposerContext();
    const [nodeKey, setNodeKey] = useState<NodeKey>();
    const buttonRef = useRef<HTMLButtonElement>(null);

    useValidateNodeClasses([MathNode]);

    useEffect(() => {
        function handleEnter(key: NodeKey) {
            setNodeKey(key);
        }

        function handleLeave(e: MouseEvent) {
            const {current} = buttonRef;
            const related = e.relatedTarget as Element;

            if(related === current || related.contains(current)) return;
            setNodeKey(undefined);
        }

        return editor.registerMutationListener(MathNode, mutations => {
            Array.from(mutations).forEach(([key, tag]) => {
                if (tag === "destroyed") return setNodeKey(undefined);

                const isInline = editor.read(() => {
                    const node = $getNodeByKey(key);
                    if ($isMathNode(node)) return node.getInline();
                    return false;
                });

                if (!isInline) {
                    const element = editor.getElementByKey(key);
                    if (element?.hasAttribute("math-block-listener")) return;

                    element?.addEventListener("mouseenter", () => handleEnter(key));
                    element?.addEventListener("mouseleave", handleLeave);
                    element?.setAttribute("math-block-listener", true + "");
                }
            });
        });
    }, [editor]);

    const handleClick = useCallback(() => {
        if (!nodeKey) return;
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            node?.remove();
        });
    }, [editor, nodeKey]);

    const handleMouseLeave = useCallback((e: React.MouseEvent) => {
        if (!nodeKey) return;   
        const element = editor.getElementByKey(nodeKey);
        const related = e.relatedTarget as Element;
        if(related === element || element?.contains(related)) return;

        setNodeKey(undefined);
    }, [editor, nodeKey]);

    return <Action open={!!nodeKey} placement="top-end" inner nodeKey={nodeKey} anchor={props.anchor}>
        <Button type="text" danger icon={<DeleteOutlined />} ref={buttonRef}
            onClick={handleClick} onMouseLeave={handleMouseLeave} />
    </Action>
}