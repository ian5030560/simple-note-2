import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useEffect, useState } from "react";
import { EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RAISE_ERROR } from "./errorPlugin";

interface SavePluginProps{
    onSave: (editorState: EditorState) => void;
}
const SavePlugin = (props: SavePluginProps) => {
    const [editor] = useLexicalComposerContext();
    const [typing, isTyping] = useState(false);

    useEffect(() => {

        function handleTyping() {
            const content = editor.getEditorState();
            try{
                props.onSave(content);
            }
            catch(err){
                if(err instanceof Error){
                    editor.dispatchCommand(RAISE_ERROR, err);
                }
            }
            isTyping(false);
        }

        let timer: NodeJS.Timer | undefined = undefined;
        if (typing) {
            timer = setTimeout(handleTyping, 500);
        }

        return () => timer && clearTimeout(timer);
    }, [editor, props, typing]);

    return <OnChangePlugin onChange={() => isTyping(true)} ignoreSelectionChange={true} />;
}
export default SavePlugin;