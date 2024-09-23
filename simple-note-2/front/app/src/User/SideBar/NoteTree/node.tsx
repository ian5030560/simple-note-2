import { Flex, Typography, Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";


const { Text } = Typography;

interface NodeProp {
    first?: boolean;
    title: string;
    onAdd: () => void;
    onDelete: () => void;
    onClick: () => void;
}

export default function Node(prop: NodeProp) {

    return <Flex justify="space-between" onClick={prop.onClick}
        style={{ paddingTop: 3, paddingBottom: 3, overflow: "hidden" }}>
        <Text>{prop.title}</Text>
        <Flex>
            {!prop.first &&
                <Button icon={<DeleteOutlined />} type="text" size="small" tabIndex={-1}
                    onClick={(e) => { e.stopPropagation(); prop.onDelete() }} />
            }
            <Button icon={<PlusOutlined />} type="text" size="small" tabIndex={-1}
                onClick={(e) => { e.stopPropagation(); prop.onAdd() }} />
        </Flex>
    </Flex>
}