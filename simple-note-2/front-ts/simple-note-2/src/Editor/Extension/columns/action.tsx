import { Button } from "antd";
import { FaRegTrashAlt } from "react-icons/fa";
import { $findMatchingParent } from "@lexical/utils";
import Corner, { CornerRef } from "../UI/corner";
import { $isColumnItemNode, ColumnItemNode } from "./item";
import { useCallback, useRef, useState } from "react";
import { $getNodeByKey, $isRangeSelection, BaseSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const ColumnAction = () => {
    const ref = useRef<CornerRef>(null);
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState<string | null>(null);

    const handleSelection = useCallback((selection: BaseSelection | null) => {
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const p = $findMatchingParent(node, $isColumnItemNode);
            if (p) {
                ref.current?.place(p.getKey());
                setKey(p.getKey());
                return;
            }
        }
        ref.current?.leave();
        setKey(null);
    }, []);

    return <Corner nodeType={ColumnItemNode} ref={ref} placement={["top", "right"]}
        trigger="selected" onSeletionChange={handleSelection}>
        <Button type="text" icon={<FaRegTrashAlt />} onClick={() => {
            if(key){
                editor.update(() => {
                    let node = $getNodeByKey(key);
                    if($isColumnItemNode(node)){
                        node.remove();
                    }
                })
            }
        }}/>
    </Corner>
}

export default ColumnAction;