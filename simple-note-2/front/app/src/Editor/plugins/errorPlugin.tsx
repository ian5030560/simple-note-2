import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_CRITICAL, createCommand, LexicalCommand, LexicalEditor } from "lexical";
import { useEffect } from "react";

export const RAISE_ERROR: LexicalCommand<Error> = createCommand();
interface ErrorPluginProps{
    whenRaiseError: (err: Error, editor: LexicalEditor) => void;
}
export default function ErrorPlugin(props: ErrorPluginProps){
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.registerCommand(RAISE_ERROR, error => {
        props.whenRaiseError(error, editor);
        return true;
    }, COMMAND_PRIORITY_CRITICAL), [editor, props]);
    return null;
}