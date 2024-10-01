import { INSERT_CANVAS } from "../Extension/canvas/plugin";
import { PlusItem } from "../Draggable/component";
import { FaPaintBrush } from "react-icons/fa";
import { $getNodeByKey, $isBlockElementNode } from "lexical";
import { $isBlockSelected } from "./utils";

const Canvas: PlusItem = {
    value: "canvas",
    label: "Canvas",
    icon: <FaPaintBrush size={24}/>,
    onSelect: (editor, nodeKey) => {
        const node = $getNodeByKey(nodeKey);
        if(!$isBlockElementNode(node) || !$isBlockSelected(node)) node?.selectEnd();
        editor.dispatchCommand(INSERT_CANVAS, undefined);
    }
}

export default Canvas;