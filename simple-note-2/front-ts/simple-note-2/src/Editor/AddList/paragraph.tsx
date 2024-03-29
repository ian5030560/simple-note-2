import { INSERT_PARAGRAPH_COMMAND, LexicalEditor } from "lexical";
import { AddItem } from "../Draggable/component";
import {BsParagraph} from "react-icons/bs";

const Paragraph: AddItem = {
    value: "paragraph",
    label: "Paragraph",
    icon: <BsParagraph size={24}/>,
    onSelect: (editor: LexicalEditor) => {
        editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
    }
}

export default Paragraph;