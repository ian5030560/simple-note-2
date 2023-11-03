import React, { useState, useRef, useCallback } from "react";
import { createReactEditorJS } from "react-editor-js";
import DragDrop from "editorjs-drag-drop";
import { tools } from "./editList";

const ReactEditorJS = createReactEditorJS();

const Editor = ({data}) => {

    const editorRef = useRef();

    const [blocks, setBlocks] = useState([]);

    const handleInitialize = useCallback((instance) => {
        editorRef.current = instance;
        console.log("Initialize");
    }, [])

    const handleReady = () => {
        new DragDrop(editorRef.current._editorJS);
        console.log("Ready");
    }

    const handleChange = async () => {
        const savedData = await editorRef.current.save();
        setBlocks(prev => savedData["blocks"]);
        console.log("Saved data: " + savedData);
    }

    return <ReactEditorJS
        tools={tools}
        defaultValue={{
            time: new Date().getTime(),
            blocks: blocks
        }}
        onInitialize={handleInitialize}
        onReady={handleReady}
        onChange={handleChange}
    />
}

export default Editor;