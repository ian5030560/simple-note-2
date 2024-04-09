import { OPEN_CANVAS } from "../Extension/canvas/modal";
import { AddItem } from "../Draggable/component";
import { FaPaintBrush } from "react-icons/fa";

const Canvas: AddItem = {
    value: "canvas",
    label: "Canvas",
    icon: <FaPaintBrush size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_CANVAS, null)
}

export default Canvas;