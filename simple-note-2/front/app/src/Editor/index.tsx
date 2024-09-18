import React from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import ToolBarPlugin from "./ToolBar/index";
import DraggablePlugin from "./Draggable";
import loader from "./loader";
import PLUSLIST from "./plusList";
import CollaboratePlugin from "./Collaborate";
import SavePlugin from "./Save";
import ToolKitPlugin from "./ToolKit";

function onError(error: Error) {
    console.error(error);
}

const Loader = loader();
const Editor = () => {
    
    return <LexicalComposer
        initialConfig={{
            namespace: 'Editor', theme: Loader.theme, onError, nodes: Loader.nodes,
        }}>
        <SavePlugin />
        <ToolBarPlugin />
        <ToolKitPlugin />
        <DraggablePlugin plusList={PLUSLIST} />
        <CollaboratePlugin />
        {Loader.plugins.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
    </LexicalComposer>;
}

export default Editor;