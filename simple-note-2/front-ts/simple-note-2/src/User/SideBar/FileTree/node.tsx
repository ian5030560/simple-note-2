import React, { useState } from "react";
import { Modal, Input, Flex, Typography, theme, ModalProps } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { determineWhiteOrBlack } from "../../../util/color";
import PropTypes from 'prop-types';

const { Text } = Typography;

const ToolLine = ({ nodeKey, onDelete, onAdd, root }) => {

    const { token } = theme.useToken();

    return <Flex style={{ color: determineWhiteOrBlack(token.colorPrimary) }}>
        {!root && <DeleteOutlined
            onClick={(e) => {
                e.stopPropagation();
                onDelete?.(nodeKey);
            }}
        />}

        <PlusOutlined
            onClick={(e) => {
                e.stopPropagation();;
                onAdd?.(nodeKey);
            }}
        />
    </Flex>
}

interface NodeProp {
    text: string,
    nodeKey: string,
    onAdd: (key: string, text: string) => void,
    onDelete: (key: string, text: string) => void,
    root: boolean,
    addModalRender: React.ReactNode,
    deleteModalRender: React.ReactNode,
    addModalProp: ModalProps,
    deleteModalProp: ModalProps
}
const Node: React.FC<NodeProp> = (prop) => {

    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelte] = useState(false);
    const { token } = theme.useToken();

    return <>
        <Flex gap={"large"}>
            <Text ellipsis style={{ color: determineWhiteOrBlack(token.colorPrimary), whiteSpace: "nowrap" }}>{prop.text}</Text>
            <ToolLine
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

interface IndividualProp {
    text: string,
    nodeKey: string,
    onAdd: (key: string, text: string) => void,
    onDelete: (key: string, text: string) => void,
    root: any,
}

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
        addModalRender={<Input value={input} placeholder="請輸入..." onChange={(e) => setInput(() => e.target.value)}/>}
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

export function createIndiviualNode(
    text: string, 
    nodeKey: string, 
    onAdd: (key: string, text: string) => void, 
    onDelete: (key: string, text: string) => void, 
    root: any
) {
    return <IndividualNode
        text={text}
        nodeKey={nodeKey}
        onAdd={onAdd}
        onDelete={onDelete}
        root={root}
    />;
}