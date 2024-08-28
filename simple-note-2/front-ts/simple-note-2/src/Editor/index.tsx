import React from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import ToolBarPlugin from "./ToolBar/index";
import DraggablePlugin from "./Draggable";
import Loader from "./loader";
import PLUSLIST from "./plusList";
import { LIST } from "./toolbar";
import CollaboratePlugin from "./Collaborate";
import SavePlugin from "./Save";
import ToolKitPlugin from "./ToolKit";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { styleSheet } = Loader;

function onError(error: Error) {
    console.error(error);
}

const Editor = () => {

    return <LexicalComposer
        initialConfig={{
            namespace: 'Editor', theme: Loader.theme, 
            onError, nodes: Loader.nodes,
        }}>
        <SavePlugin/>
        <ToolBarPlugin toolbars={LIST} />
        <ToolKitPlugin/>
        <DraggablePlugin plusList={PLUSLIST} />
        <CollaboratePlugin />
        {Loader.plugins.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
    </LexicalComposer>;
}

export default Editor;