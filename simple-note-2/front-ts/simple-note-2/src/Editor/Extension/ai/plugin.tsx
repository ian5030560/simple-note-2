import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { Placeholder } from "./component";
import { useEffect, useState } from "react";
import {mergeRegister} from "@lexical/utils";
import { $getSelection, $isParagraphNode, $isRangeSelection, CLICK_COMMAND } from "lexical";
import { useWrapper } from "../../Draggable/component";

const DEFAULT = {top: -10000, left: -10000};
export const AIPlaceholderPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const [text, setText] = useState("");
    const [pos, setPos] = useState(DEFAULT);
    const wrapper = useWrapper();

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(CLICK_COMMAND, (e) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if($isRangeSelection(selection) && selection.isCollapsed() && wrapper){
                        const node = selection.anchor.getNode();
                        let pos = DEFAULT;
                        if($isParagraphNode(node)){
                            const {clientX: x, clientY: y} = e;
                            const {top, left, height} = wrapper.getBoundingClientRect();
                            pos = {top: y - top - height, left: x - left};
                            setText("Hello");
                        }
                        setPos(pos);
                    }
                })
                return true;
            }, 4)
        )
    }, [editor, wrapper]);

    return <Placeholder text={text} top={pos.top} left={pos.left}/>
}