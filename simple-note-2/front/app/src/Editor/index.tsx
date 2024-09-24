import React, { useEffect, useMemo } from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import ToolBarPlugin from "./ToolBar/index";
import DraggablePlugin from "./Draggable";
import loader from "./loader";
import PLUSLIST from "./plusList";
import CollaboratePlugin from "./Collaborate";
import SavePlugin from "./Save";
import ToolKitPlugin from "./ToolKit";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { Button, Flex, Result } from "antd";
import { SyncOutlined } from "@ant-design/icons";

function onError(error: Error) {
    console.error(error);
}

const Loader = loader();
const Editor = ({ test }: { test?: boolean }) => {
    const data = useLoaderData();
    const navigate = useNavigate();
    const { id, host } = useParams();

    return test || data !== false ? <LexicalComposer
        initialConfig={{
            namespace: 'Editor', theme: Loader.theme, onError, nodes: Loader.nodes,
        }}>
        {!test && <SavePlugin initialNote={data as string | undefined} collab={!!(id && host)}/>}
        <ToolBarPlugin />
        <ToolKitPlugin />
        <DraggablePlugin plusList={PLUSLIST} />
        {(!test && host) ? <CollaboratePlugin room={`${host}/${id}`} /> : test ? <CollaboratePlugin room="test" /> : null}
        {Loader.plugins.map((plugin, index) => <React.Fragment key={index}>{plugin}</React.Fragment>)}
    </LexicalComposer> :
        <Flex justify="center" align="center" style={{ height: "100%" }}>
            <Result status={"error"} title="取得內容失敗" subTitle="此筆記無法取得內容，請重新整理"
                extra={<Button type="primary" icon={<SyncOutlined />} onClick={() => navigate(0)}>重新整理</Button>} />
        </Flex>;
}

export default Editor;