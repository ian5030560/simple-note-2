import React, { useState } from "react";
import OptionGroup, { Option } from "../Basic/option";
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from "@ant-design/icons";
import { useSelectionListener } from "../Hooks";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, ElementFormatType, $isElementNode, ElementNode } from "lexical";
import { $findMatchingParent } from "@lexical/utils";

const ALIGN: Option[] = [
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

const Align: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [current, setCurrent] = useState<string | undefined>();

    useSelectionListener({
        handler: (selection) => {
            let node = selection?.getNodes()[0];
            if (!node) return;

            let parent = $findMatchingParent(
                node,
                (p) => $isElementNode(p) && !p.isInline()
            )
            
            let result = $isElementNode(parent);
            let text = result ? (parent as ElementNode).getFormatType() : "left";
            setCurrent(() => text);
        },
        priority: 1,
    })

    return <OptionGroup
        options={ALIGN}
        select={(key) => current === key}
        onClick={(key) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, key as ElementFormatType)}
    />
}

export default Align;