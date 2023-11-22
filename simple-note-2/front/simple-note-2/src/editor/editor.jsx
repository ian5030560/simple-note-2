import React, { useState, useRef, useCallback } from "react";
import { createReactEditorJS } from "react-editor-js";
import DragDrop from "editorjs-drag-drop";
import { tools } from "./editList";
import Undo from 'editorjs-undo';

const ReactEditorJS = createReactEditorJS();

/**
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

    const handleReady = useCallback(() => {
        const editor = editorRef.current._editorJS;
        new Undo({ editor });
        new DragDrop(editor);
        
        console.log("Ready");
    },[])

    const handleChange = async () => {
        const savedData = await editorRef.current.save();
        setBlocks(prev => savedData["blocks"]);
        console.log(savedData["blocks"]);
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