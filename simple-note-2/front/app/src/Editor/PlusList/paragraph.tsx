import { $createParagraphNode, $getNodeByKey, LexicalEditor, NodeKey } from "lexical";
import { PlusItem } from "../Draggable/component";
import { BsParagraph } from "react-icons/bs";

const Paragraph: PlusItem = {
    value: "paragraph",
    label: "Paragraph",
    icon: <BsParagraph size={24} />,
    onSelect: (editor: LexicalEditor, nodeKey: NodeKey) => {
        $getNodeByKey(nodeKey)?.insertAfter($createParagraphNode());
    }
}

export default Paragraph;