import { INSERT_CANVAS } from "../Extension/canvas/plugin";
import { AddItem } from "../Draggable/component";
import { FaPaintBrush } from "react-icons/fa";

const Canvas: AddItem = {
    value: "canvas",
    label: "Canvas",
    icon: <FaPaintBrush size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(INSERT_CANVAS, undefined)
}

export default Canvas;