import { $getNodeByKey } from "lexical";
import { PlusItem } from "../Draggable/component";
import { OPEN_DOCUMENT_MODAL } from "../Extension/document/modal";
import { IoDocumentText } from "react-icons/io5";

const Document: PlusItem = {
    value: "document",
    label: "Document",
    icon: <IoDocumentText size={24}/>,
    onSelect: (editor, nodeKey) => {
        $getNodeByKey(nodeKey)?.selectEnd();
        editor.dispatchCommand(OPEN_DOCUMENT_MODAL, undefined)
    }
}

export default Document;