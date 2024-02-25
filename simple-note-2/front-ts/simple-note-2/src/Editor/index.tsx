import React from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import PLUGINS from "./plugins";
import config from "./config";
import ToolBarPlugin from "./ToolBar";

const Editor: React.FC = () => {

    return <LexicalComposer initialConfig={config}>
        <ToolBarPlugin />
        {PLUGINS.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
    </LexicalComposer>
}

export default Editor;