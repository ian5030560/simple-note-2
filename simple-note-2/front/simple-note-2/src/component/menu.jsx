import React, { useState } from "react"
import { Collapse, Menu, Flex, Typography } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
const { Text } = Typography;

const ToolLine = ({ onDelete, onAdd }) => {

    return <Flex>
        <DeleteOutlined
            onClick={(e) => {
                e.stopPropagation();;
                onDelete?.();
            }} />
        <PlusOutlined
            onClick={(e) => {
                e.stopPropagation();;
                onAdd?.();
            }}
        />
    </Flex>
}

const NodeMenu = ({ items }) => {

    return <Collapse
        items={items}
        ghost
    />
}

/**
 * 
 * @param {{data: Array}} param0 
 * @returns 
 */
const FileMenu = ({ title, menuKey, data }) => {

    // const [children, setChildren] = useState(data ? data: []);

    // const handleAdd = () => {

    //     setChildren(prev => {

    //         return [
    //             ...prev,
    //             {
    //                 key: `${menuKey}-${prev.length}`,
    //                 label: title,
    //                 extra: <ToolLine onAdd={handleAdd} onDelete={handleDelete}/>,
    //                 children: <NodeMenu items={[]}/>
    //             }
    //         ]
    //     })
    // }

    // const handleDelete = () => {

    // }

    // const items = [
    //     {
    //         key: menuKey,
    //         label: title,
    //         extra: <ToolLine onAdd={handleAdd} onDelete={handleDelete}/>,
    //         children: <NodeMenu items={children}/>
    //     }
    // ]

    // return <Collapse
    //     items={items}
    //     ghost
    //     style={{ marginLeft: "16px" }}
    // />

    const items = [
        {
            key: menuKey,
            label: <Flex
                gap={"small"}
                justify="space-between">
                {title}
                <ToolLine />
            </Flex>,
            children: [

            ]
        }
    ]

    return <Menu
        items={items}
        mode="inline"
        expandIcon = {null}
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