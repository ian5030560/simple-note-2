import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin as LexicalListPlugin } from "@lexical/react/LexicalListPlugin";
import { $createParagraphNode, COMMAND_PRIORITY_CRITICAL } from "lexical";
import { useEffect } from "react";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from "@lexical/list";

export default function ListPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({ node, keyPath }) => {
        if (keyPath[0] === "list") {
            const p = $createParagraphNode();
            node.insertAfter(p);
            p.select();
            if (keyPath[1] === "number") {
                editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            }
            else if (keyPath[1] === "bullet") {
                editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            }
            else if (keyPath[1] === "checked") {
                editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
            }
        }
        return false;
    }, COMMAND_PRIORITY_CRITICAL))
    return <LexicalListPlugin />
}