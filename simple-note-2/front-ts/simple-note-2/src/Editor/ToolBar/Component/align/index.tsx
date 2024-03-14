import React, { useCallback, useEffect, useState } from "react";
import OptionGroup, { Option } from "../UI/option";
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from "@ant-design/icons";
import { useSelectionListener } from "../Hooks";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_ELEMENT_COMMAND, ElementFormatType, $isElementNode, ElementNode, SELECTION_CHANGE_COMMAND, $getSelection, $isRangeSelection, $isNodeSelection, LexicalNode, $isBlockElementNode } from "lexical";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { mergeRegister } from "@lexical/utils";

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

    // useSelectionListener((selection) => {
    //         let node = selection?.getNodes()[0];
    //         if (!node) return;
    //         let parent = node.getTopLevelElement();

    //         let result = $isElementNode(parent) || $isDecoratorBlockNode(parent);
    //         console.log(result);
    //         let text = result ? (parent as ElementNode).getFormatType() : "left";
    //         setCurrent(() => text);
    //     }, 1)
    const handleSelect = useCallback(() => {
        const selection = $getSelection();

        let text: string | undefined = undefined;
        if ($isRangeSelection(selection) || $isNodeSelection(selection)) {
            let node = selection.getNodes()[0];
            
            if(!$isBlockElementNode(node) && !$isDecoratorBlockNode(node)){
                node = node.getTopLevelElement()!;
            }
            
            if($isElementNode(node)){
                text = node.getFormatType();
            }
            else if($isDecoratorBlockNode(node)){
                text = node.__format;
            }
        }

        setCurrent(() => text);
        return false;
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(SELECTION_CHANGE_COMMAND, handleSelect, 1),
            editor.registerUpdateListener(({editorState}) => editorState.read(handleSelect)),
        );
    })

    return <OptionGroup
        options={ALIGN}
        select={(key) => current === key}
        onClick={(key) => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, key !== current ? key as ElementFormatType : "")}
    />
}

export default Align;