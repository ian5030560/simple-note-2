import { Plugin } from "../../index";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useCallback } from "react";
import { EditorState, LexicalEditor } from "lexical";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const SavePlugin: Plugin = () => {

    // const [editor] = useLexicalComposerContext();
    const handleChange = useCallback((editorState: EditorState, _: LexicalEditor, tags: Set<string>) => {
        console.log(editorState);
    }, []);

    return <OnChangePlugin onChange={handleChange} />;
}
export default SavePlugin;