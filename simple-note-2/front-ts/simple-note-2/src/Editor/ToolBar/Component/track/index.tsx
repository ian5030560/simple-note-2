import React from "react";
import { Flex, Button } from "antd";
import { RedoOutlined, UndoOutlined } from "@ant-design/icons";

const Track: React.FC = () => {
    return <Flex>
        <Button icon={<UndoOutlined />} onClick={() => {}} />
        <Button icon={<RedoOutlined />} onClick={() => {}} />
    </Flex>
}

export default Track;