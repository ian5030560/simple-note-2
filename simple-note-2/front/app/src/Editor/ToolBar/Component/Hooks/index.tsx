import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RangeSelection, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, CommandListenerPriority, TextNode } from "lexical";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";

export function useSelectionListener(
    handler: (selection: RangeSelection) => void,
    priority: CommandListenerPriority,
    stopPropagation: boolean = false,
) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) handler(selection);
                })
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _) => {
                    editor.update(() => {
                        const selection = $getSelection();
                        // if (selection) handler(selection as RangeSelection);
                        if ($isRangeSelection(selection)) handler(selection);
                    });
                    return stopPropagation;
                }, priority
            )
        );
    }, [editor, handler, priority, stopPropagation])
}