import { $getNodeByKey } from "lexical";
import { FaFileCode } from "react-icons/fa";
import { $createCodeNode } from "@lexical/code";
import { PlusItem } from "../plugins/draggablePlugin/component";

const Code: PlusItem = {
    value: "code",
    label: "Code",
    icon: <FaFileCode size={24} />,
    onSelect: (_, nodeKey) => $getNodeByKey(nodeKey)?.insertAfter($createCodeNode())
}

export default Code;