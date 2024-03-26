import React, { useState } from "react";
import { Modal, Input, Flex, Typography, theme, ModalProps } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { determineWhiteOrBlack } from "../../../util/color";

const { Text } = Typography;

interface ToolButtonsProp {
    nodeKey: string,
    onDelete: (key: string) => void,
    onAdd: (key: string) => void,
    root: boolean
}
const ToolButtons: React.FC<ToolButtonsProp> = ({ nodeKey, onDelete, onAdd, root }) => {

    // const { token } = theme.useToken();

    return <Flex>
        {!root && <DeleteOutlined
            onClick={(e) => {
                e.preventDefault();
                onDelete?.(nodeKey);
            }}
        />}

        <PlusOutlined
            onClick={(e) => {
                e.preventDefault();
                onAdd?.(nodeKey);
            }}
        />
    </Flex>
}

interface NodeProp {
    text: React.ReactNode,
    nodeKey: string,
    onAdd: (key: string, text: React.ReactNode) => void,
    onDelete: (key: string, text: React.ReactNode) => void,
    root: boolean,
    addModalRender: React.ReactNode,
    deleteModalRender: React.ReactNode,
    addModalProp: ModalProps,
    deleteModalProp: ModalProps
}
const Node: React.FC<NodeProp> = (prop) => {

    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelte] = useState(false);
    // const { token } = theme.useToken();

    return <>
        <Flex gap={"large"} onClick={(e) => e.preventDefault()}>
            <Text ellipsis style={{ whiteSpace: "nowrap" }}>{prop.text}</Text>
            <ToolButtons
                nodeKey={prop.nodeKey}
                onAdd={() => setOpenAdd(true)}
                onDelete={() => setOpenDelte(true)}
                root={prop.root}
            />
        </Flex>
        <Modal open={openAdd}
            onCancel={() => setOpenAdd(false)}
            onOk={() => { setOpenAdd(false); prop.onAdd?.(prop.nodeKey, prop.text) }}
            {...prop.addModalProp}>
            {prop.addModalRender}
        </Modal>
        <Modal open={openDelete}
            onCancel={() => setOpenDelte(false)}
            onOk={() => { setOpenDelte(false); prop.onDelete?.(prop.nodeKey, prop.text) }}
            {...prop.deleteModalProp}
        >
            {prop.deleteModalRender}
        </Modal>
    </>
}

type IndividualProp = Pick<NodeProp, "text" | "nodeKey" | "onAdd" | "onDelete" | "root">;

const IndividualNode: React.FC<IndividualProp> = ({ text, nodeKey, onAdd, onDelete, root }) => {

    const [input, setInput] = useState("");

    return <Node
        text={text}
        nodeKey={nodeKey}
        onAdd={() => {
            onAdd?.(nodeKey, input);
            setInput(() => "");
        }}
        onDelete={onDelete}
        root={root}
        addModalRender={<Input value={input} placeholder="請輸入..." onChange={(e) => setInput(() => e.target.value)} />}
        addModalProp={{ title: "輸入名稱" }}
        deleteModalRender={<Text>是否刪除{text}</Text>}
        deleteModalProp={{
            title: `刪除${text}`,
            okText: "是",
            okType: "danger",
            cancelText: "否"
        }}
    />
}

export type NodeCreater = (
    text: React.ReactNode,
    nodeKey: string,
    onAdd: (key: string, text: React.ReactNode) => void,
    onDelete: (key: string, text: React.ReactNode) => void,
    root: boolean
) => React.JSX.Element;

export const createIndiviualNode: NodeCreater = (
    text,
    nodeKey,
    onAdd,
    onDelete,
    root
) => <IndividualNode
        text={text}
        nodeKey={nodeKey}
        onAdd={onAdd}
        onDelete={onDelete}
        root={root}
    />;