import { OPEN_CANVAS } from "../Lexical/canvas";
import { AddItem } from "../Lexical/draggable/component";
import { FaPaintBrush } from "react-icons/fa";

const Canvas: AddItem = {
    value: "canvas",
    label: "Canvas",
    icon: <FaPaintBrush size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_CANVAS, null)
}

export default Canvas;