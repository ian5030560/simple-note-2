import { AddItem } from "../Lexical/draggable/component";
import { $findMatchingParent } from "@lexical/utils";
import { $getSelection, $isBlockElementNode, $isRangeSelection, ElementNode, LexicalEditor } from "lexical";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import {BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6} from "react-icons/bs";

const heading = [
    {
        value: "h1",
        label: "H1",
        icon: <BsTypeH1 size={24}/>,
    },
    {
        value: "h2",
        label: "H2",
        icon: <BsTypeH2 size={24}/>,
    },
    {
        value: "h3",
        label: "H3",
        icon: <BsTypeH3 size={24}/>,
    },
    {
        value: "h4",
        label: "H4",
        icon: <BsTypeH4 size={24}/>,
    },
    {
        value: "h5",
        label: "H5",
        icon: <BsTypeH5 size={24}/>,
    },
    {
        value: "h6",
        label: "H6",
        icon: <BsTypeH6 size={24}/>,
    },
]
const Heading: AddItem[] = heading.map((head) => {
    return {
        ...head,
        onSelect: (editor: LexicalEditor) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    let node = selection.anchor.getNode();
                    if (!$isBlockElementNode(node)) {
                        node = $findMatchingParent(node, (p) => $isBlockElementNode(p))! as ElementNode;
                    }
    
                    const newNode = $createHeadingNode(head.value as HeadingTagType);
                    node.insertAfter(newNode);
                }
            })
        }
    }
})

export default Heading;