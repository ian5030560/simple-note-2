import { $getSelection, $isRangeSelection } from "lexical";
import { PlusItem } from "../Draggable/component";
import { FaFileCode } from "react-icons/fa";
import { $createCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";

const Code: PlusItem = {
    value: "code",
    label: "Code",
    icon: <FaFileCode size={24} />,
    onSelect: (editor) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // if (selection.isCollapsed()) {
                $setBlocksType(selection, () => $createCodeNode());
                // } else {
                //     const textContent = selection.getTextContent();
                //     const codeNode = $createCodeNode();
                //     selection.insertNodes([codeNode]);
                //     selection.insertRawText(textContent);
                // }
            }
        })
    }
}

export default Code;