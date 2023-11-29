import React, { useState } from "react"
import { Tree, Menu, Flex, Typography, theme } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
const { Text } = Typography;

const ToolLine = ({ nodeKey, onDelete, onAdd }) => {

    return <Flex>
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
        <Text ellipsis>{text}</Text>
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

/**
 * 
 * @param {{data: Array}} param0 
 * @returns 
 */
const FileMenu = ({ i_data, m_data }) => {

    const { token } = theme.useToken();
    const [i_children, setI_Children] = useState(i_data ? i_data : []);
    const [m_children, setM_Children] = useState(m_data ? m_data : []);

    const handleAdd = (nodeKey, setMethod) => {

        setMethod(prev => {
            let target = findTargetByKey(nodeKey, prev);

            let key = `${nodeKey}-${target.length}`;
            target.push({
                key: key,
                title: <Node
                    text={key}
                    nodeKey={key}
                    onAdd={(k) => handleAdd(k, setMethod)}
                    onDelete={(k) => handleDelete(k, setMethod)}
                />,
                children: []
            })

            return [...prev]
        })
    }

    /**
     * 
     * @param {string} nodeKey 
     */
    const handleDelete = (nodeKey, setMethod) => {

        setMethod(prev => {
            
            let parent = getParentKey(nodeKey);
            let target = findTargetByKey(parent, prev);
            let i = parseInt(nodeKey.charAt(nodeKey.length - 1));
            target.splice(i, 1);

            function changeSubtreeKey(t, p) {
                
                for (let index in t) {
                    let key = `${p}-${index}`;

                    t[index].key = key;
                    t[index].title = <Node
                        text={key}
                        nodeKey={key}
                        onAdd={(k) => handleAdd(k, setMethod)}
                        onDelete={(k) => handleDelete(k, setMethod)}
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
                onAdd={(key) => handleAdd(key, setI_Children)}
                onDelete={(key) => handleDelete(key, setI_Children)}
            />,
            children: i_children
        },
        {
            key: "multiple",
            title: <Node
                text={"多人協作"}
                nodeKey={"multiple"}
                onAdd={(key) => handleAdd(key, setM_Children)}
                onDelete={(key) => handleDelete(key, setM_Children)}
            />,
            children: m_children
        }
    ]

    return <Tree
        treeData={rootData}
        rootStyle={{ backgroundColor: token.colorPrimary }}
        // onSelect={(key) => console.log(key)}
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