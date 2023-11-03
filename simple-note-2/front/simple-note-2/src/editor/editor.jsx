import React, { useState, useRef, useCallback } from "react"; 
import {createReactEditorJS} from "react-editor-js";
import DragDrop from "editorjs-drag-drop";
import { tools } from "./toollist";

const ReactEditorJS = createReactEditorJS();

const Editor = () => {
    /**
     * @type {React.MutableRefObject<EditorCore>}
     */
    const editorRef = useRef();

    const [blocks, setBlocks] = useState([
        {
            id: "sheNwCUP5A",
            type: "header",
            data: {
              text: "Editor.js",
              level: 2
            }
        }
    ]);

    const handleInitialize = useCallback((instance) => {
        editorRef.current = instance;
    }, [])

    const handleReady = () => {
        new DragDrop(editorRef.current._editorJS);
    }

    const handleSave = async () => {
        const savedData = await editorRef.current.save();
        console.log(savedData);
    }

    return <div>
        <ReactEditorJS
        tools={tools} 
        defaultValue={{
            time: new Date().getTime(),
            blocks: blocks
        }}
        onInitialize={handleInitialize}
        onReady={handleReady}
        
        />
    </div>
}

export default Editor;