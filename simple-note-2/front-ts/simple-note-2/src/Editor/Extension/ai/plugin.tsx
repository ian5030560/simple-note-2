import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { Placeholder } from "./component";
import { useEffect, useRef, useState } from "react";
import { mergeRegister, $getNearestBlockElementAncestorOrThrow } from "@lexical/utils";
import { $getSelection, $isParagraphNode, $isRangeSelection} from "lexical";
import { useWrapper } from "../../Draggable/component";
import { useScroller } from "../basic/richtext/scroller";

function getCaretDOM(){
    return window.getSelection()?.getRangeAt(0).getBoundingClientRect();
}

const DEFAULT = { top: -10000, left: -10000 };
export const AIPlaceholderPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const [text, setText] = useState("");
    const [pos, setPos] = useState(DEFAULT);
    const ref = useRef<HTMLDivElement>(null);
    const wrapper = useWrapper();

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection) && selection.isCollapsed() && wrapper) {
                        const node = selection.anchor.getNode();
                        const bnode = $getNearestBlockElementAncestorOrThrow(node);
                        let pos = DEFAULT;
                        if ($isParagraphNode(bnode)) {
                            let {x} = getCaretDOM()!;
                            let element = editor.getElementByKey(node.getKey())!;
                            let {y, height} = element.getBoundingClientRect();
                            let {top, left} = wrapper.getBoundingClientRect();
                            
                            ref.current!.style.height = `${height}px`;
                            pos = {left: x - left, top: y - top };
                            setText("Hello");
                        }
                        setPos(pos);
                    }
                })
            })
        )
    }, [editor, wrapper]);

    return <Placeholder text={text} top={pos.top} left={pos.left} ref={ref}/>
}