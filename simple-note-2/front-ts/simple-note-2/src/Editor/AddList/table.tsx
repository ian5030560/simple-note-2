import { AddItem } from "../Draggable/component";
import { FaTableCells } from "react-icons/fa6";
import { OPEN_TABLE_MODAL } from "../Extension/table/modal";

const Table: AddItem = {
    value: "table",
    label: "Table",
    icon: <FaTableCells size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_TABLE_MODAL, undefined),
}

export default Table;