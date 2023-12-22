import React from "react";
import { Drawer, Typography } from "antd";
const {Title} = Typography;

const ChatDrawer = ({ open, onClose }) => {
    return <Drawer
        title=<Title level={3}>與AI聊天</Title>
        open={open}
        placement="right"
        onClose={onClose}>
                
    </Drawer>
}

export {ChatDrawer}