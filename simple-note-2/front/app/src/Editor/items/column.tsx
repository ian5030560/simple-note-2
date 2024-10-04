import { FaColumns } from "react-icons/fa";
import { $getNodeByKey } from "lexical";
import { OPEN_COLUMN_MODAL } from "../plugins/columnPlugin/command";
import { PlusItem } from "../plugins/draggablePlugin/component";

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