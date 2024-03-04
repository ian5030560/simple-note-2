import { AddItem } from "../Draggable/component";
import { OPEN_TABLE_MODAL } from "../Extension/table/modal";
import { FaTable } from "react-icons/fa";

const Table: AddItem = {
    value: "table",
    label: "Table",
    icon: <FaTable size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_TABLE_MODAL, undefined),
}

export default Table;