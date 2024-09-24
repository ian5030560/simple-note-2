import { Plugin } from "../Extension/index";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback, useEffect, useState } from "react";
import { CLEAR_EDITOR_COMMAND, EditorState } from "lexical";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useAPI, { APIs } from "../../util/api";
import { decodeBase64 } from "../../util/secret";

const empty = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const SavePlugin: Plugin<{ initialNote?: string, collab: boolean }> = (props) => {
    const saveNote = useAPI(APIs.saveNote);
    const [editor] = useLexicalComposerContext();
    const [{ username }] = useCookies(["username"]);
    const { id, host } = useParams();
    const [typing, isTyping] = useState(false);

    useEffect(() => {
        const { initialNote } = props;

        if (initialNote !== undefined) {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            const editorState = editor.parseEditorState(JSON.parse(initialNote ? initialNote : empty));
            editor.setEditorState(editorState);
        }
    }, [editor, props]);

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
        isTyping(() => !props.collab ? true : decodeBase64(host!) === username);
        
    }, [host, props.collab, username]);

    return <OnChangePlugin onChange={handleChange} ignoreSelectionChange={true} />;
}
export default SavePlugin;