import React, {useState, useRef} from "react";
import {Modal, Input, Flex, Typography, theme} from "antd";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import { determineWhiteOrBlack } from "../../../util/color";

const {Text} = Typography;

const ToolLine = ({ nodeKey, onDelete, onAdd, root }) => {
    
    const {token} = theme.useToken();

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

// eslint-disable-next-line no-unused-vars
const NodeProp = {
    text: "",
    nodeKey: "",
    onAdd: (key, text) => {},
    onDelete: (key, text) => {},
    root: false,
    /**
     * @type {React.ReactNode}
     */
    addModalRender: undefined,
    /**
     * @type {React.ReactNode}
     */
    deleteModalRender: undefined,
    addModalProp: {},
    deleteModalProp: {}
}

/**
 * 
 * @param {NodeProp} prop 
 * @returns 
 */
const Node = (prop) => {

    const [openAdd, setOpenAdd] = useState(false);
    const [openDelete, setOpenDelte] = useState(false);
    const {token} = theme.useToken();

    return <>
        <Flex gap={"large"}>
            <Text ellipsis style={{ color: determineWhiteOrBlack(token.colorPrimary) }}>{prop.text}</Text>
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

const IndividualNode = ({text, nodeKey, onAdd, onDelete, root}) => {

    const ref = useRef();

    return <Node
        text={text}
        nodeKey={nodeKey}
        onAdd={() => onAdd?.(nodeKey, ref.current.input.value)}
        onDelete={onDelete}
        root={root}
        addModalRender={<Input ref={ref} placeholder="請輸入..."/>}
        addModalProp={{title: "輸入名稱"}}
        deleteModalRender={<Text>是否刪除{text}</Text>}
        deleteModalProp={{
            title: `刪除${text}`,
            okText: "是",
            okType: "danger",
            cancelText: "否"
        }}
    />
}

export function createIndiviualNode(text, nodeKey, onAdd, onDelete, root){
    return <IndividualNode
        text={text}
        nodeKey={nodeKey}
        onAdd={onAdd}
        onDelete={onDelete}
        root={root}
    />;
}