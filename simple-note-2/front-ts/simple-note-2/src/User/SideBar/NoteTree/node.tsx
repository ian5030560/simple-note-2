import { useMemo, useState } from "react";
import { Modal, Input, Flex, Typography, Button, Dropdown } from "antd";
import { DeleteOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { ItemType } from "antd/es/menu/interface";


const { Text } = Typography;

interface NodeProp {
    title: string;
    onAdd: () => void;
    onDelete: () => void;
    onClick: () => void;
}

export default function Node(prop: NodeProp) {

    const items: ItemType[] = useMemo(() => [{
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
    }], []);

    return <Flex justify="space-between" onClick={() => { }}
        style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
        <Text>{prop.title}</Text>
        <Flex>
            {prop.title !== "我的筆記" &&
                <Button icon={<DeleteOutlined />} type="text" size="small" tabIndex={-1}
                    onClick={(e) => { e.stopPropagation(); prop.onDelete() }} />
            }
            <Button icon={<PlusOutlined />} type="text" size="small" tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); prop.onAdd() }} />
            <Dropdown trigger={["click"]} placement="bottomCenter" menu={{ items: items }}>
                <Button icon={<MoreOutlined />} type="text" size="small" tabIndex={-1} />
            </Dropdown>
        </Flex>
    </Flex>
}