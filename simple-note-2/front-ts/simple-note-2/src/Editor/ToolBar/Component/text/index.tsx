import React, { useState } from "react";
import { Select } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useSelectionListener } from "../Hooks";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection, $createParagraphNode, $isElementNode, ElementNode, $isParagraphNode, LexicalNode } from "lexical";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";

const TEXT = [
    {
        value: "paragraph",
        label: "Paragraph",
    },
    {
        value: "h1",
        label: "H1",
    },
    {
        value: "h2",
        label: "H2",
    },
    {
        value: "h3",
        label: "H3",
    },
    {
        value: "h4",
        label: "H4",
    },
    {
        value: "h5",
        label: "H5",
    },
    {
        value: "h6",
        label: "H6",
    }
]

const handlers: { [x: string]: () => ElementNode } = {
    paragraph: () => $createParagraphNode(),
    h1: () => $createHeadingNode("h1"),
    h2: () => $createHeadingNode("h2"),
    h3: () => $createHeadingNode("h3"),
    h4: () => $createHeadingNode("h4"),
    h5: () => $createHeadingNode("h5"),
    h6: () => $createHeadingNode("h6")
};

const Text: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const [current, setCurrent] = useState<string | null>();

    useSelectionListener({
        handler: (selection) => {
            const node = selection.getNodes()[0];
            let result: LexicalNode | null;
            if($isElementNode(node)) result = node;
            else{
                let parent = $findMatchingParent(
                    node,
                    (p) => $isElementNode(p) && !p.isInline()
                );
                result = parent;
            }
            setCurrent(() => $isParagraphNode(result) ? "paragraph" : $isHeadingNode(result) ? result.getTag() : undefined);
        },
        priority: 1,
    })

    return <Select
        options={TEXT}
        value={current}
        onChange={value => {
            editor.update(() => {
                const selection = $getSelection();

                if(!$isRangeSelection(selection)) return;

                const node = selection.getNodes()[0];
                if($isElementNode(node)){
                    $setBlocksType(selection, handlers[value]);
                }   
                else{
                    let parent = $findMatchingParent(
                        node,
                        (p) => $isElementNode(p) && !p.isInline()
                    );
                    if(!$isElementNode(parent)) return;
                    $setBlocksType(selection, handlers[value]);
                }
            })
        }}
    />
}

export default Text;