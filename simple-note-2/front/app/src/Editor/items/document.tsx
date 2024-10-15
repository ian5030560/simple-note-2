import { IoDocumentText } from "react-icons/io5";
import { OPEN_DOCUMENT_MODAL } from "../plugins/documentPlugin/modal";
import { PlusItem } from "../plugins/draggablePlugin/component";

const Document: PlusItem = {
    value: "document",
    label: "Document",
    icon: <IoDocumentText size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_DOCUMENT_MODAL, undefined)
}

export default Document;