import { Plugin } from "../../index";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback, useContext, useEffect, useState } from "react";
import { CLEAR_EDITOR_COMMAND, EditorState } from "lexical";
import useAPI, { APIs } from "../../../../util/api";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import { Note } from "../../../../util/provider";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const empty = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

const SavePlugin: Plugin = () => {
    const saveNote = useAPI(APIs.saveNote);
    const initialNote = useContext(Note);
    const [editor] = useLexicalComposerContext();
    const [{ username }] = useCookies(["username"]);
    const { file } = useParams();
    const [typing, isTyping] = useState(false);

    useEffect(() => {
        if(initialNote){
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined)
            
            if(initialNote === '"0"'){
                editor.setEditorState(editor.parseEditorState(empty))
            }
            else{
                let editorState = editor.parseEditorState(JSON.parse(initialNote))
                editor.setEditorState(editorState)
            }
        }
    }, [editor, file, initialNote]);

    useEffect(() => {
    
        function handleTyping() {
            const content = editor.getEditorState()
            saveNote({
                username: username,
                noteId: file!,
                content: JSON.stringify(content.toJSON()),
            })
            isTyping(false);
        }

        let timer: NodeJS.Timer | undefined = undefined;
        if(typing){
            timer = setTimeout(handleTyping, 500);
        }

        return () => timer && clearTimeout(timer);
    }, [editor, file, saveNote, typing, username]);

    const handleChange = useCallback((editorState: EditorState) => {
        console.log(editorState);
        if(window.location.pathname !== "/test"){
            isTyping(true);
        }
    }, []);

    return <OnChangePlugin onChange={handleChange} />;
}
export default SavePlugin;