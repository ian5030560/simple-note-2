import React, { useCallback, useEffect, useState } from "react";
import OptionGroup, { Option } from "../UI/option";
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
            let node = selection.getNodes()[0];

            if($isElementNode(node) || $isDecoratorBlockNode(node)){
                text = node.__format as string;
            }
            else{
                let parent = $findMatchingParent(node, p => $isElementNode(p) || $isDecoratorBlockNode(p)) as ElementNode | DecoratorBlockNode | null;
                if(parent){
                    text = parent.__format as string;
                }
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