import { $createParagraphNode, $getSelection, $isBlockElementNode, $isRangeSelection, LexicalEditor } from "lexical";
import { PlusItem } from "../Draggable/component";
import { BsParagraph } from "react-icons/bs";
import { $findMatchingParent, $insertNodeToNearestRoot } from "@lexical/utils";

const Paragraph: PlusItem = {
    value: "paragraph",
    label: "Paragraph",
    icon: <BsParagraph size={24} />,
    onSelect: (editor: LexicalEditor) => {
        editor.update(() => {
            const newNode = $createParagraphNode();
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
                $insertNodeToNearestRoot(newNode);
            }
            else {
                const focused = selection.anchor.getNode();
                let block = $isBlockElementNode(focused) ? focused : $findMatchingParent(focused, node => $isBlockElementNode(node));

                block?.insertAfter(newNode, false);
            }
        })
    }
}

export default Paragraph;