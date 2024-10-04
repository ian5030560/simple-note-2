import { FaTable } from "react-icons/fa";
import { PlusItem } from "../plugins/draggablePlugin/component";
import { OPEN_TABLE_MODAL } from "../plugins/tablePlugins/modal";

const Table: PlusItem = {
    value: "table",
    label: "Table",
    icon: <FaTable size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_TABLE_MODAL, undefined),
}

export default Table;