import { Button } from "antd";
import { FaRegTrashAlt } from "react-icons/fa";
import { $findMatchingParent } from "@lexical/utils";
import Corner, { CornerRef } from "../UI/corner";
import { $isColumnItemNode, ColumnItemNode } from "./item";
import { useCallback, useRef, useState } from "react";
import { $getNodeByKey, $isRangeSelection, BaseSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isColumnContainerNode } from "./container";
import { FaPlus } from "react-icons/fa6";
import { APPEND_COLUMNS } from "./plugin";
import styles from "./action.module.css";

const ColumnAction = () => {
    const deleteRef = useRef<CornerRef>(null);
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState<string | null>(null);
    const addRef = useRef<CornerRef>(null);

    const handleSelection = useCallback((selection: BaseSelection | null) => {
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const p = $findMatchingParent(node, $isColumnItemNode);
            if (p) {
                deleteRef.current?.place(p.getKey());
                addRef.current?.place(p.getKey());
                setKey(p.getKey());
                return;
            }
        }
        deleteRef.current?.leave();
        addRef.current?.leave();
        setKey(null);
    }, []);

    return <>
        <Corner nodeType={ColumnItemNode} ref={deleteRef} placement={["top", "right"]}
            trigger="selected" onSeletionChange={handleSelection}>
            <Button type="text" icon={<FaRegTrashAlt />} onClick={() => {
                if (!key) return;

                editor.update(() => {
                    let node = $getNodeByKey(key);
                    if ($isColumnItemNode(node)) {
                        let pNode = $findMatchingParent(node, $isColumnContainerNode);
                        node.remove();
                        if ($isColumnContainerNode(pNode)) {
                            let size = pNode.getChildrenSize();
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
        </Corner>

        <Corner nodeType={ColumnItemNode} ref={addRef} placement={["right"]} outside
            trigger="selected" onSeletionChange={handleSelection} autoHeight className={styles.columnAddContainer}>
            <Button type="text" icon={<FaPlus />} style={{ height: "inherit", width: 20 }}
                onClick={() => editor.dispatchCommand(APPEND_COLUMNS, 1)} />
        </Corner>
    </>
}

export default ColumnAction;