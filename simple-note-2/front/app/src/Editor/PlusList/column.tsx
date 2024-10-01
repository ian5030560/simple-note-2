import { PlusItem } from "../Draggable/component";
import { FaColumns } from "react-icons/fa";
import { OPEN_COLUMN_MODAL } from "../Extension/columns/plugin";
import { $getNodeByKey } from "lexical";

const Column: PlusItem = {
    value: "column",
    label: "Column",
    icon: <FaColumns size={24}/>,
    onSelect: (editor, nodeKey) => {
        $getNodeByKey(nodeKey)?.selectEnd();
        editor.dispatchCommand(OPEN_COLUMN_MODAL, undefined);
    }
}

export default Column;