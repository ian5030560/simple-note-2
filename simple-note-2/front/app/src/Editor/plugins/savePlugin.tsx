import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback, useEffect, useState } from "react";
import { $createParagraphNode, $getRoot, EditorState } from "lexical";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useAPI from "../../util/api";

export function $empty(){
    const p = $createParagraphNode();
    $getRoot().append(p);
    p.select(); 
}
const SavePlugin = () => {
    const saveNote = useAPI(APIs.saveNote);
    const [editor] = useLexicalComposerContext();
    const [{ username }] = useCookies(["username"]);
    const { id } = useParams();
    const [typing, isTyping] = useState(false);

    useEffect(() => {

        function handleTyping() {
            const content = editor.getEditorState()
            saveNote({
                username: username,
                noteId: id!,
                content: JSON.stringify(content.toJSON()),
            })[0].then((res) => {
                if (res.status === 200) {
                    console.log("saved!!");
                }
            })
            isTyping(false);
        }

        let timer: NodeJS.Timer | undefined = undefined;
        if (typing) {
            timer = setTimeout(handleTyping, 500);
        }

        return () => timer && clearTimeout(timer);
    }, [editor, id, saveNote, typing, username]);

    const handleChange = useCallback((editorState: EditorState) => {
        console.log(editorState);
        isTyping(() => true);

    }, []);

    return <OnChangePlugin onChange={handleChange} ignoreSelectionChange={true} />;
}
export default SavePlugin;