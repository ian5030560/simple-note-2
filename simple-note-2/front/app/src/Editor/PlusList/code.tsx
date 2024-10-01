import { $createParagraphNode, $getNodeByKey, $getSelection, $isRangeSelection } from "lexical";
import { PlusItem } from "../Draggable/component";
import { FaFileCode } from "react-icons/fa";
import { $createCodeNode } from "@lexical/code";

const Code: PlusItem = {
    value: "code",
    label: "Code",
    icon: <FaFileCode size={24} />,
    onSelect: (_, nodeKey) => $getNodeByKey(nodeKey)?.insertAfter($createCodeNode())
}

export default Code;