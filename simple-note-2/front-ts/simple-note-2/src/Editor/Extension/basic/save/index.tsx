import { Plugin } from "../../index";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback, useEffect, useState } from "react";
import { EditorState } from "lexical";
import useAPI, { APIs } from "../../../../util/api";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

const SavePlugin: Plugin = () => {
    const saveNote = useAPI(APIs.saveNote);
    const [state, setState] = useState<EditorState>();
    const [{ username }] = useCookies(["username"]);
    const { file } = useParams();
    const [typing, isTyping] = useState(false);

    useEffect(() => {
        function handleUnload() {
            // saveNote({
            //     username: username,
            //     noteId: file,
            //     content: state!.toJSON(),
            // })
            // isTyping(false);
        }

        let timer: NodeJS.Timer | undefined = undefined;
        if(typing){
            timer = setTimeout(handleUnload, 500);
        }

        return () => timer && clearTimeout(timer);
    }, [file, saveNote, state, typing, username]);

    const handleChange = useCallback((editorState: EditorState) => {
        console.log(editorState);
        setState(editorState);
        isTyping(true);
    }, []);

    return <OnChangePlugin onChange={handleChange} />;
}
export default SavePlugin;