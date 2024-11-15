import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, SELECTION_CHANGE_COMMAND, CommandListenerPriority, TextNode, BaseSelection } from "lexical";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";

export default function useSelectionListener(
    handler: (selection: BaseSelection | null) => boolean,
    priority: CommandListenerPriority,
) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        mergeRegister(
            editor.registerUpdateListener(({ editorState }) => editorState.read(() => handler($getSelection()))),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => handler($getSelection()), priority)
        );
    }, [editor, handler, priority])
}