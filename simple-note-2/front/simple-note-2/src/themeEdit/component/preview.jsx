import React from "react";
import '../../../node_modules/reactflow/dist/style.css';
import ReactFlow, {MiniMap} from "reactflow";
import {Index as User} from "../../user/user";

const PreviewComponent = () => {
    return <User rootstyle={{
        width: "1200px",
        height: "600px",
    }}/>;
}

const nodes = [
    {id: 'view', type: "preview", position: { x: 0, y: 0 }},
];

const Preview = () => {
    return <>
        <ReactFlow nodes={nodes} nodeTypes={{ preview: PreviewComponent }} fitView/>
        <MiniMap/>
    </>
    
}

export default Preview