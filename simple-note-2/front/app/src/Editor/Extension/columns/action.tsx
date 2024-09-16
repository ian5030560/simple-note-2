import { Button } from "antd";
import { FaRegTrashAlt } from "react-icons/fa";
import { $findMatchingParent } from "@lexical/utils";
import Action from "../UI/action";
import { $isColumnItemNode, ColumnItemNode } from "./item";
import { useEffect, useRef, useState } from "react";
import { $getNodeByKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isColumnContainerNode } from "./container";
import { FaPlus } from "react-icons/fa6";
import { APPEND_COLUMNS } from "./plugin";
import { inside } from "../UI/utils";

const ColumnAction = () => {
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState<string | null>(null);
    const [add, setAdd] = useState(false);
    const [remove, setRemove] = useState(false);
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const removeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => editor.registerMutationListener(ColumnItemNode, (mutations) => {
        Array.from(mutations).forEach(([key, tag]) => {
            if (tag === "updated") return;

            const element = editor.getElementByKey(key);
            if (!element) return;

            element.addEventListener("mouseenter", () => {
                setAdd(true);
                setRemove(true);
                setKey(key);
            });

            element.addEventListener("mouseleave", (e) => {
                const { clientX: x, clientY: y } = e;
                const addButton = addButtonRef.current;
                const removeButton = removeButtonRef.current;
                if(addButton && removeButton && (inside(x, y, addButton) || inside(x, y, removeButton))) return;
                setAdd(false);
                setRemove(true);
                setKey(null);
            });
        });
    }), [editor]);

    return key ? <>
        <Action placement={["top", "right"]} open={remove} nodeKey={key}>
            <Button type="text" icon={<FaRegTrashAlt />} ref={removeButtonRef} onClick={() => {
                if (!key) return;

                editor.update(() => {
                    const node = $getNodeByKey(key);
                    if ($isColumnItemNode(node)) {
                        const pNode = $findMatchingParent(node, $isColumnContainerNode);
                        node.remove();
                        if ($isColumnContainerNode(pNode)) {
                            const size = pNode.getChildrenSize();
                            if (size === 0) {
                                pNode.remove();
                            }
                            else {
                                pNode.setNumber(size);
                            }
                        }
                    }
                })

            }} />
        </Action>

        <Action nodeKey={key} placement={{ top: false, right: true }} open={add} autoHeight>
            <Button ref={addButtonRef} type="text" icon={<FaPlus />} size="small" style={{ height: "100%" }}
                onClick={() => editor.dispatchCommand(APPEND_COLUMNS, 1)} />
        </Action>
    </> : null;
}

export default ColumnAction;