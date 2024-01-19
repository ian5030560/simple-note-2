import React, { useState } from "react";
import { Modal, Input, Flex, Typography, theme } from "antd";
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

const Node = (prop) => {

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

Node.propTypes = {
    text: PropTypes.string,
    nodeKey: PropTypes.string,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    root: PropTypes.bool,
    addModalRender: PropTypes.element,
    deleteModalRender: PropTypes.element,
    addModalProp: PropTypes.object,
    deleteModalProp: PropTypes.object
}

const IndividualNode = ({ text, nodeKey, onAdd, onDelete, root }) => {

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

export function createIndiviualNode(text, nodeKey, onAdd, onDelete, root) {
    return <IndividualNode
        text={text}
        nodeKey={nodeKey}
        onAdd={onAdd}
        onDelete={onDelete}
        root={root}
    />;
}