import React, { useEffect } from "react";
import "reactflow/dist/style.css";
import ReactFlow, { Controls, Background, BackgroundVariant, useNodesState } from "reactflow";
import { ConfigProvider, ThemeConfig } from "antd";
import { Node } from "@reactflow/core/dist/esm/types/nodes"
import Editor from "../Editor/editor";
import User from "../User/component";

const PreviewComponent = ({ data }: { data: ThemeConfig }) => {
    return <ConfigProvider theme={data}>
        <User style={{ width: 1200, height: 600 }}>
            <Editor editable={false}/>
        </User>;
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

export default function Preview({ theme }: { theme: ThemeConfig }){

    const [nodes, setNodes, onNodeChange] = useNodesState(initNodes);

    useEffect(() => {
        setNodes(prev => {
            return prev.map((n) => ({
                ...n,
                data: theme,
            }))
        })
    }, [setNodes, theme]);

    return <ReactFlow nodes={nodes} nodeTypes={nodeTypes}
        fitView nodesDraggable={false} onNodesChange={onNodeChange}
    >
        <Controls showInteractive={false} />
        <Background variant={BackgroundVariant.Dots} size={3} />
    </ReactFlow>
}