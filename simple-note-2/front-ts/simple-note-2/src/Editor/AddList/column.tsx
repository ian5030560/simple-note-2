import { AddItem } from "../Draggable/component";
import { FaColumns } from "react-icons/fa";
import { OPEN_COLUMN_MODAL } from "../Extension/columns/plugin";

const Column: AddItem = {
    value: "column",
    label: "Column",
    icon: <FaColumns size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_COLUMN_MODAL, undefined)
}

export default Column;