import { useState } from "react";
import { Select } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useSelectionListener from "./useSelectionListener";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection, $createParagraphNode, $isElementNode, ElementNode, $isParagraphNode, LexicalNode } from "lexical";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";

const options = [
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

export default function Text() {

    const [editor] = useLexicalComposerContext();
    const [nodeType, setNodeType] = useState<keyof typeof handlers | null>();

    useSelectionListener((selection) => {
        if ($isRangeSelection(selection)) {
            const node = selection.getNodes()[0];
            const parent = $isElementNode(node) ? node :
                $findMatchingParent(node, (p) => $isElementNode(p) && !p.isInline());
            setNodeType(() => $isParagraphNode(parent) ? "paragraph" :
                $isHeadingNode(parent) ? parent.getTag() : undefined
            );
        }

        return false;
    }, 1)

    return <Select options={options} value={nodeType}
        onChange={value => editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const node = selection.anchor.getNode();
                if ($isElementNode(node)) {
                    $setBlocksType(selection, handlers[value]);
                }
                else {
                    const parent = $findMatchingParent(node, (p) => $isElementNode(p) && !p.isInline());
                    if (!$isElementNode(parent)) return;
                    $setBlocksType(selection, handlers[value]);
                }
            }
        })}
    />
}