import React, { useCallback, useEffect, useState } from "react";
import OptionGroup, { Option } from "./UI/option";
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, ElementFormatType, $isElementNode, SELECTION_CHANGE_COMMAND, $getSelection, $isRangeSelection, $isNodeSelection, LexicalNode, $isBlockElementNode, ElementNode } from "lexical";
import { $isDecoratorBlockNode, DecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { mergeRegister, $findMatchingParent } from "@lexical/utils";

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

    const handleSelect = useCallback(() => {
        const selection = $getSelection();

        let text: string | undefined = undefined;
        if ($isRangeSelection(selection) || $isNodeSelection(selection)) {
            const node = selection.getNodes()[0];

            let tmp: ElementNode | DecoratorBlockNode | null;
            tmp = $isElementNode(node) || $isDecoratorBlockNode(node) ? node :
                $findMatchingParent(node, p => $isElementNode(p) || $isDecoratorBlockNode(p)) as ElementNode | DecoratorBlockNode | null;

            if($isElementNode(tmp)){
                text = tmp.getFormatType();
            }

            if($isDecoratorBlockNode(tmp)){
                text = tmp.__format;
            }
        }

        setCurrent(() => text);
        return false;
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(SELECTION_CHANGE_COMMAND, handleSelect, 1),
            editor.registerUpdateListener(({ editorState }) => editorState.read(handleSelect)),
        );
    })

    return <OptionGroup options={ALIGN} select={(key) => current === key}
        onClick={(key) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, key !== current ? key as ElementFormatType : "")}
    />
}

export default Align;