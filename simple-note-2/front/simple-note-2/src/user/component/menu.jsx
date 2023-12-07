import React, { useState } from "react"
import { Tree, Menu, theme } from "antd";
import { createIndiviualNode } from "./node";
import { determineWhiteOrBlack } from "../../util/color";

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
}) => {

    const { token } = theme.useToken();
    const [i_children, setI_Children] = useState(!i_data ? [] :
        i_data.map(data => {
            return {
                key: data.key,
                title: createIndiviualNode(
                    data.title,
                    data.key,
                    (k, t) => handleAdd(k, t, setI_Children, createIndiviualNode),
                    (k) => handleDelete(k, setI_Children, createIndiviualNode),
                    false
                ),
                children: data.children,
                name: data.name
            }
        })
    );

    const [m_children, setM_Children] = useState(!m_data ? [] :
        m_data.map(data => {
            return {
                key: data.key,
                title: createIndiviualNode(
                    data.title,
                    data.key,
                    (k, t) => handleAdd(k, t, setM_Children, createIndiviualNode),
                    (k) => handleDelete(k, setM_Children, createIndiviualNode),
                    false
                ),
                children: data.children,
                name: data.name
            }
        })
    );

    const handleAdd = (nodeKey, text, setChildren, createNode) => {
    
        setChildren(prev => {
            let target = findTargetByKey(nodeKey, prev);

            let key = `${nodeKey}-${target.length}`;
            target.push({
                key: key,
                title: createNode(
                    text,
                    key,
                    (k, t) => handleAdd(k, t, setChildren, createNode),
                    (k) => handleDelete(k, setChildren, createNode),
                    false
                ),
                children: [],
                name: text
            })

            return [...prev]
        })
    }

    /**
     * 
     * @param {string} nodeKey 
     */
    const handleDelete = (nodeKey, setChildren, createNode) => {

        setChildren(prev => {

            let parent = getParentKey(nodeKey);
            let target = findTargetByKey(parent, prev);
            let i = parseInt(nodeKey.charAt(nodeKey.length - 1));
            target.splice(i, 1);

            function changeSubtreeKey(t, p) {

                for (let index in t) {
                    let key = `${p}-${index}`;

                    t[index].key = key;
                    t[index].title = createNode(
                        t[index].name,
                        key,
                        (k, t) => handleAdd(k, t, setChildren, createNode),
                        (k) =>  handleDelete(k, setChildren, createNode),
                        false
                    )

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
            title: createIndiviualNode(
                "個人筆記",
                "individual",
                (k, t) => handleAdd(k, t, setI_Children, createIndiviualNode),
                (k) => handleDelete(k, setI_Children, createIndiviualNode),
                true
            ),
            children: i_children
        },
        {
            key: "multiple",
            title: createIndiviualNode(
                "多人協作",
                "multiple",
                (k, t) => handleAdd(k, t, setM_Children, createIndiviualNode),
                (k) => handleDelete(k, setM_Children, createIndiviualNode),
                true
            ),
            children: m_children
        }
    ]

    return <Tree
        treeData={rootData}
        rootStyle={{
            backgroundColor: token.colorPrimary,
            // color: determineWhiteOrBlack(token.colorPrimary)
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