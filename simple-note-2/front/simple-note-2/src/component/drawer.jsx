import React from "react";
import { Drawer } from "antd";

const ChatDrawer = ({ open, onClose }) => {
    return <Drawer
        title="與AI聊天"
        open={open}
        placement="right"
        onClose={onClose}>

    </Drawer>
}

export {ChatDrawer}