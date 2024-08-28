import { INSERT_PARAGRAPH_COMMAND, LexicalEditor } from "lexical";
import { PlusItem } from "../Draggable/component";
import {BsParagraph} from "react-icons/bs";

const Paragraph: PlusItem = {
    value: "paragraph",
    label: "Paragraph",
    icon: <BsParagraph size={24}/>,
    onSelect: (editor: LexicalEditor) => {
        editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
    }
}

export default Paragraph;