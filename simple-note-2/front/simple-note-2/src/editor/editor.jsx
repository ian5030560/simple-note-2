import React, { useState, useRef, useCallback } from "react";
import { createReactEditorJS } from "react-editor-js";
import DragDrop from "editorjs-drag-drop";
import { tools } from "./editList";

const ReactEditorJS = createReactEditorJS();

/**
 * 
 * @param {{initlizeData: []}} param0 
 * @returns 
 */
const Editor = ({initlizeData}) => {

    const editorRef = useRef();

    const [blocks, setBlocks] = useState(initlizeData);

    const handleInitialize = useCallback((instance) => {
        editorRef.current = instance;
        console.log("Initialize");
    }, [])

    const handleReady = () => {
        new DragDrop(editorRef.current._editorJS);
        console.log("Ready");
    }

    const handleChange = () => {
        editorRef.current.save().then((output) => {
            setBlocks(output["blocks"]);
            console.log(output);
        }).catch(e => {
            console.log(e);
        });
    }

    return <ReactEditorJS
        tools={tools}
        holder="editor"
        defaultValue={blocks}
        onInitialize={handleInitialize}
        onReady={handleReady}
        onChange={handleChange}
    />
}

export default Editor;