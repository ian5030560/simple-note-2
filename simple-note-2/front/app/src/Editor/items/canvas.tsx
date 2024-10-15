import { FaPaintBrush } from "react-icons/fa";
import { INSERT_CANVAS } from "../plugins/canvasPlugin";
import { PlusItem } from "../plugins/draggablePlugin/component";

const Canvas: PlusItem = {
    value: "canvas",
    label: "Canvas",
    icon: <FaPaintBrush size={24}/>,
    onSelect: (editor, nodeKey) => editor.dispatchCommand(INSERT_CANVAS, nodeKey)
}

export default Canvas;