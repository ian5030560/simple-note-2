import { Plugin } from "../Extension/index";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CLEAR_EDITOR_COMMAND, EditorState } from "lexical";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useAPI, { APIs } from "../../util/api";
import { Note } from "../../util/provider";
import { decodeBase64 } from "../../util/secret";
import { useCollab } from "../Collaborate/store";

const empty = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const SavePlugin: Plugin = () => {
    const saveNote = useAPI(APIs.saveNote);
    const initialNote = useContext(Note);
    const [editor] = useLexicalComposerContext();
    const [{ username }] = useCookies(["username"]);
    const { activate, room } = useCollab();
    const { id, host } = useParams();
    const [typing, isTyping] = useState(false);
    const collaborative = useMemo(() => !!(activate && room), [activate, room]);
    
    useEffect(() => {
        if (collaborative && host !== username) return;

        if (initialNote) {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
            if (initialNote === '"0"') {
                editor.setEditorState(editor.parseEditorState(empty));
            }
            else {
                let editorState = editor.parseEditorState(JSON.parse(initialNote));
                editor.setEditorState(editorState);
            }
        }
    }, [activate, collaborative, editor, host, initialNote, room, username]);

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

        if (window.location.pathname !== "/test") {
            isTyping(() => !collaborative ? true : decodeBase64(host!) === username);
        }
    }, [collaborative, host, username]);

    return <OnChangePlugin onChange={handleChange} />;
}
export default SavePlugin;