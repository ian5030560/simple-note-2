import { Plugin } from "../Interface";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import { useCallback } from "react";
import { EditorState } from "lexical";

const SavePlugin: Plugin = () => {

    const handleChange = useCallback((editorState: EditorState) => {
        // console.log(editorState.toJSON());
    }, []);

    return <OnChangePlugin onChange={handleChange}/>;
}
export default SavePlugin;