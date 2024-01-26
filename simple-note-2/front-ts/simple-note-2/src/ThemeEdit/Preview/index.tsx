import React from "react";
import '../../../node_modules/reactflow/dist/style.css';
import ReactFlow, { Controls, Background, BackgroundVariant } from "reactflow";
import { Index as User } from "../../User";
import { ConfigProvider } from "antd";
import { Node } from "@reactflow/core/dist/esm/types/nodes"

const PreviewComponent = () => {
    return <User rootStyle={{
        width: "1200px",
        height: "600px",
    }} />;
}

const nodes: Node<any, string | undefined>[] = [
    {
        id: 'view',
        type: "preview",
        position: { x: 0, y: 0 },
        selectable: false,
        focusable: false,
        data: undefined,
    },
];

const Preview = ({ theme }) => {

    return <ConfigProvider
        theme={theme}
    >
        <ReactFlow
            nodes={nodes}
            nodeTypes={{ preview: PreviewComponent }}
            fitView
            nodesDraggable={false}
        >
            <Controls showInteractive={false} />
            <Background variant={BackgroundVariant.Dots} size={3} />
        </ReactFlow>
    </ConfigProvider>

}

export default Preview