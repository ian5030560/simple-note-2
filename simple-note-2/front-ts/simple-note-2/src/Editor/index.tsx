import React from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import "./index.css";
import PLUGINS from "./plugins";
import config from "./config";

const Editor: React.FC = () => {

    return <LexicalComposer initialConfig={config}>
        {PLUGINS.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
    </LexicalComposer>
}

export default Editor;