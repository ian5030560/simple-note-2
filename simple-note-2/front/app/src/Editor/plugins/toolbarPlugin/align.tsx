import { useState } from "react";
import OptionButtonGroup, { Option } from "./ui/optionButtonGroup";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, ElementFormatType, $isElementNode, $isRangeSelection, $isNodeSelection, ElementNode } from "lexical";
import { $isDecoratorBlockNode, DecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { $findMatchingParent } from "@lexical/utils";
import useSelectionListener from "./useSelectionListener";
import { AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined } from "@ant-design/icons";

const options: Option[] = [
    {
        key: "left",
        icon: <AlignLeftOutlined />
    },
    {
        key: "center",
        icon: <AlignCenterOutlined />
    },
    {
        key: "right",
        icon: <AlignRightOutlined />
    }
]

export default function Align() {
    const [editor] = useLexicalComposerContext();
    const [value, setValue] = useState<string>();

    useSelectionListener((selection) => {
        let val: string | undefined = undefined;
        if ($isRangeSelection(selection) || $isNodeSelection(selection)) {
            const node = selection.getNodes()[0];

            let parent: ElementNode | DecoratorBlockNode | null;
            parent = $isElementNode(node) || $isDecoratorBlockNode(node) ? node :
                $findMatchingParent(node, p => $isElementNode(p) || $isDecoratorBlockNode(p)) as ElementNode | DecoratorBlockNode | null;

            if ($isElementNode(parent)) {
                val = parent.getFormatType();
            }

            if ($isDecoratorBlockNode(parent)) {
                val = parent.__format;
            }
        }
        setValue(val);

        return false;
    }, 1);

    return <OptionButtonGroup value={value} options={options}
        onSelect={(key) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value !== key ? key as ElementFormatType : "")} />
}