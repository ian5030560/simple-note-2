import {$createParagraphNode, COMMAND_PRIORITY_CRITICAL } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import CanvasNode, { $createCanvasNode } from "../nodes/canvas";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import { useValidateNodeClasses } from "../utils";

export default function CanvasPlugin() {
    const [editor] = useLexicalComposerContext();

    useValidateNodeClasses([CanvasNode]);
    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({node, value}) => {
        if(value === "canvas"){
            const p = $createParagraphNode();
            const canvas = $createCanvasNode();
            node.insertAfter(p);
            p.append(canvas);
        };
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    return null;
}