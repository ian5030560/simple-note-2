import { $createParagraphNode, LexicalEditor } from "lexical";
import { PlusItem } from "../Draggable/component";
import {BsParagraph} from "react-icons/bs";
import { $insertNodeToNearestRoot } from "@lexical/utils";

const Paragraph: PlusItem = {
    value: "paragraph",
    label: "Paragraph",
    icon: <BsParagraph size={24}/>,
    onSelect: (editor: LexicalEditor) => {
        editor.update(() => {
            const newNode = $createParagraphNode();
            $insertNodeToNearestRoot(newNode);
        })
    }
}

export default Paragraph;