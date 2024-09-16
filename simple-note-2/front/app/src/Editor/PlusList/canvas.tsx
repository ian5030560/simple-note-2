import { INSERT_CANVAS } from "../Extension/canvas/plugin";
import { PlusItem } from "../Draggable/component";
import { FaPaintBrush } from "react-icons/fa";

const Canvas: PlusItem = {
    value: "canvas",
    label: "Canvas",
    icon: <FaPaintBrush size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(INSERT_CANVAS, undefined)
}

export default Canvas;