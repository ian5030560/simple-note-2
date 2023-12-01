import React, { useState } from "react"
import { Tree, Menu, Flex, Typography, theme } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
const { Text } = Typography;

const ToolLine = ({ nodeKey, onDelete, onAdd }) => {

    return <Flex style={{ color: "white" }}>
        <DeleteOutlined
            onClick={(e) => {
                e.stopPropagation();;
                onDelete?.(nodeKey);
            }} />
        <PlusOutlined
            onClick={(e) => {
                e.stopPropagation();;
                onAdd?.(nodeKey);
            }}
        />
    </Flex>
}

const Node = ({ text, nodeKey, onAdd, onDelete }) => {

    return <Flex gap={"large"}>
        <Text ellipsis style={{ color: "white" }}>{text}</Text>
        <ToolLine
            nodeKey={nodeKey}
            onAdd={onAdd}
            onDelete={onDelete}
        />
    </Flex>
}

/**
 * 
 * @param {string} key 
 * @param {Array} origin 
 */
function findTargetByKey(key, origin) {
    let indice = key.split("-");

    let tmp = origin;
    for (let i of indice.slice(1)) {
        tmp = tmp[i].children
    }

    return tmp;
}

/**
 * 
 * @param {string} key 
 */
function getParentKey(key) {
    let indice = key.split("-");

    let result = indice[0]
    for (let i of indice.slice(1, -1)) {
        result = `${result}-${i}`
    }

    return result;
}

// eslint-disable-next-line no-unused-vars
const dataType = {
    key: "",
    title: "",
    /**
     * @type {Array}
     */
    children: [],
    name: "",
}
/**
 * 
 * @param {{i_data: Array<dataType>, m_data: Array<dataType>}} param0 
 * @returns 
 */
const FileMenu = ({ 
    i_data, 
    m_data, 
    onSelect, 
    onIndiviualAdd, 
    onIndiviualDelete,
    onMultipleAdd,
    onMultipleDelete
}) => {

    const { token } = theme.useToken();
    const [i_children, setI_Children] = useState(!i_data ? [] :
        i_data.map(data => {
            return {
                key: data.key,
                title: <Node
                    text={data.title}
                    nodeKey={data.key}
                    onAdd={(k) => handleAdd(k, setI_Children, onIndiviualAdd, onIndiviualDelete)}
                    onDelete={(k) => handleDelete(k, setI_Children, onIndiviualDelete, onMultipleAdd)}
                />,
                children: data.children,
                name: data.name
            }
        })
    );

    const [m_children, setM_Children] = useState(!m_data ? [] :
        m_data.map(data => {
            return {
                key: data.key,
                title: <Node
                    text={data.title}
                    nodeKey={data.key}
                    onAdd={(k) => handleAdd(k, setM_Children, onMultipleAdd, onMultipleDelete)}
                    onDelete={(k) => handleDelete(k, setM_Children, onMultipleDelete, onMultipleAdd)}
                />,
                children: data.children,
                name: data.name
            }
        })
    );

    const handleAdd = (nodeKey, setChildren, onAdd, onDelete) => {

        const input = onAdd?.();

        if(!input) return;

        setChildren(prev => {
            let target = findTargetByKey(nodeKey, prev);

            let key = `${nodeKey}-${target.length}`;
            target.push({
                key: key,
                title: <Node
                    text={input}
                    nodeKey={key}
                    onAdd={(k) => handleAdd(k, setChildren, onAdd, onDelete)}
                    onDelete={(k) => handleDelete(k, setChildren, onDelete, onAdd)}
                />,
                children: [],
                name: input
            })

            return [...prev]
        })
    }

    /**
     * 
     * @param {string} nodeKey 
     */
    const handleDelete = (nodeKey, setChildren, onDelete, onAdd) => {

        onDelete?.();

        setChildren(prev => {

            let parent = getParentKey(nodeKey);
            let target = findTargetByKey(parent, prev);
            let i = parseInt(nodeKey.charAt(nodeKey.length - 1));
            target.splice(i, 1);

            function changeSubtreeKey(t, p) {

                for (let index in t) {
                    let key = `${p}-${index}`;

                    t[index].key = key;
                    t[index].title = <Node
                        text={t[index].name}
                        nodeKey={key}
                        onAdd={(k) => handleAdd(k, setChildren, onAdd, onDelete)}
                        onDelete={(k) => handleDelete(k, setChildren, onDelete, onAdd)}
                    />

                    changeSubtreeKey(t[index].children, key);
                }
            }

            changeSubtreeKey(target, parent);

            return [...prev];
        })
    }

    const rootData = [
        {
            key: "individual",
            title: <Node
                text={"個人筆記"}
                nodeKey={"individual"}
                onAdd={(key) => handleAdd(key, setI_Children, onIndiviualAdd, onIndiviualDelete)}
                onDelete={(key) => handleDelete(key, setI_Children, onIndiviualDelete, onIndiviualAdd)}
            />,
            children: i_children
        },
        {
            key: "multiple",
            title: <Node
                text={"多人協作"}
                nodeKey={"multiple"}
                onAdd={(key) => handleAdd(key, setM_Children, onMultipleAdd, onMultipleDelete)}
                onDelete={(key) => handleDelete(key, setM_Children, onMultipleDelete, onMultipleAdd)}
            />,
            children: m_children
        }
    ]

    return <Tree
        treeData={rootData}
        rootStyle={{
            backgroundColor: token.colorPrimary,
            color: "white"
        }}
        onSelect={onSelect}
    />
}

const ThemeMenu = ({ style }) => {
    const items = [
        {
            label: "我的主題",
            key: "theme",
            children: [

            ]
        }
    ]
    return <Menu
        mode="vertical"
        items={items}
        style={style}
    />
}

export { ThemeMenu, FileMenu }