import React, { useState } from "react";
import '../../../node_modules/reactflow/dist/style.css';
import ReactFlow, { Controls, Background } from "reactflow";
import { Index as User } from "../../user/user";
import { ConfigProvider, theme } from "antd";
import defaultTheme from "../../theme/default";

const PreviewComponent = () => {
    return <User rootstyle={{
        width: "1200px",
        height: "600px",
    }} />;
}

const nodes = [
    { id: 'view', type: "preview", position: { x: 0, y: 0 }, selectable: false, focusable: false },
];

const Preview = () => {

    const [darken, setDarken] = useState(false);

    return <ConfigProvider
        theme={{
            ...defaultTheme(darken),
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
    >
        <ReactFlow
            nodes={nodes}
            nodeTypes={{ preview: PreviewComponent }}
            fitView
            nodesDraggable={false}
        >
            <Controls showInteractive={false}/>
            <Background variant="dots" size={3}/>
        </ReactFlow>
    </ConfigProvider>

}

export default Preview