import React, { useEffect, memo } from "react";
import '../../../node_modules/reactflow/dist/style.css';
import ReactFlow, { Controls, Background, BackgroundVariant, useNodesState } from "reactflow";
import { Index as User } from "../../User";
import { ConfigProvider, ThemeConfig } from "antd";
import { Node } from "@reactflow/core/dist/esm/types/nodes"

const PreviewComponent = ({ data }: { data: ThemeConfig }) => {
    return <ConfigProvider theme={data}>
        <User rootStyle={{
            width: "1200px",
            height: "600px",
        }} />;
    </ConfigProvider>
}

const initNodes: Node<ThemeConfig | undefined, string | undefined>[] = [
    {
        id: 'view',
        type: "preview",
        position: { x: 0, y: 0 },
        selectable: false,
        focusable: false,
        data: undefined,
    },
];

const nodeTypes = {
    preview: PreviewComponent,
}

const Preview = ({ theme }: { theme: ThemeConfig }) => {

    const [nodes, setNodes, onNodeChange] = useNodesState(initNodes);

    useEffect(() => {
        setNodes(prev => {
            return prev.map((n) => ({
                ...n,
                data: theme,
            }))
        })
    }, [setNodes, theme]);

    return <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        onNodesChange={onNodeChange}
    >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} size={3} />
    </ReactFlow>
}

export default Preview