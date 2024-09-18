import { $createParagraphNode, $getSelection, $isRangeSelection } from "lexical";
import { PlusItem } from "../Draggable/component";
import { FaFileCode } from "react-icons/fa";
import { $createCodeNode } from "@lexical/code";

const Code: PlusItem = {
    value: "code",
    label: "Code",
    icon: <FaFileCode size={24} />,
    onSelect: (editor) => {
        editor.update(() => {
            let selection = $getSelection();

            if (selection !== null) {
                const textContent = selection.getTextContent();
                const codeNode = $createCodeNode();
                selection.insertNodes([codeNode]);
                selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertRawText(textContent);
                }
                codeNode.insertAfter($createParagraphNode());
            }
        })
    }
}

export default Code;