import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RangeSelection, $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, CommandListenerPriority } from "lexical";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";


export interface SelectionHandler {
    handler: (selection: RangeSelection) => void,
    returnValue?: boolean,
    priority: CommandListenerPriority
};
export function useSelectionListener(handler: SelectionHandler) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    let selection = $getSelection();
                    if($isRangeSelection(selection)) handler.handler(selection);
                })
            }),

            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _) => {
                    editor.update(() => {
                        let selection = $getSelection();
                        if($isRangeSelection(selection)) handler.handler(selection);
                    });
                    return handler.returnValue ? handler.returnValue : false;
                }, handler.priority
            )
        );
    })
}