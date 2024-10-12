import { $createParagraphNode, $getNodeByKey } from "lexical";
import { BsParagraph } from "react-icons/bs";
import { PlusItem } from "../plugins/draggablePlugin/component";

const Paragraph: PlusItem = {
    value: "paragraph",
    label: "Paragraph",
    icon: <BsParagraph size={24} />,
    onSelect: (_, nodeKey) => $getNodeByKey(nodeKey)?.insertAfter($createParagraphNode())
    
}

export default Paragraph;