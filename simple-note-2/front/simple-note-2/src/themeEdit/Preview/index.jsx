import React from "react";
import '../../../node_modules/reactflow/dist/style.css';
import ReactFlow, { Controls, Background } from "reactflow";
import { Index as User } from "../../User";
import { ConfigProvider } from "antd";

const PreviewComponent = () => {
    return <User rootStyle={{
        width: "1200px",
        height: "600px",
    }} />;
}

const nodes = [
    { id: 'view', type: "preview", position: { x: 0, y: 0 }, selectable: false, focusable: false },
];

const Preview = ({theme}) => {

    return <ConfigProvider
        theme={theme}
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