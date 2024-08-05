import React, { useContext } from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import ToolBarPlugin from "./ToolBar/index";
import DraggablePlugin from "./Draggable";
import Loader from "./loader";
import ADDLIST from "./addList";
import { LIST } from "./toolbar";
import RealTimePlugin from "./RealTime";
import {Note} from "../util/provider";
import { CLEAR_EDITOR_COMMAND } from "lexical";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { styleSheet } = Loader;

function onError(error: Error) {
    console.error(error);
}

const Editor: React.FC = () => {

    return <LexicalComposer
        initialConfig={{
            namespace: 'Editor',
            theme: Loader.theme,
            onError,
            nodes: Loader.nodes,
            editorState: null
        }}>
        <ToolBarPlugin toolbars={LIST}/>
        <DraggablePlugin addList={ADDLIST} />
        {false && <RealTimePlugin/>}
        {Loader.plugins.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
    </LexicalComposer>;
}

export default Editor;