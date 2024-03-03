import { $createParagraphNode, $getSelection, $isBlockElementNode, $isRangeSelection, ElementNode, LexicalEditor } from "lexical";
import { AddItem } from "../Draggable/component";
import {BsParagraph} from "react-icons/bs";
import { $findMatchingParent } from "@lexical/utils";

const Paragraph: AddItem = {
    value: "paragraph",
    label: "Paragraph",
    icon: <BsParagraph size={24}/>,
    onSelect: (editor: LexicalEditor) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let node = selection.anchor.getNode();
                if (!$isBlockElementNode(node)) {
                    node = $findMatchingParent(node, (p) => $isBlockElementNode(p))! as ElementNode;
                }
                const newNode = $createParagraphNode();
                node.insertAfter(newNode);
            }
        })
    }
}

export default Paragraph;