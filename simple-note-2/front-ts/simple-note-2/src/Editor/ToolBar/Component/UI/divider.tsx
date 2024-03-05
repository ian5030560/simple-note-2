import React from "react";
import { theme } from "antd";

const Divider: React.FC = () => {

    const { token } = theme.useToken();

    return <span
        style={{
            display: "flex",
            justifyContent: "center",
            minHeight: "70%",
        }}>
        <div style={{
            minHeight: "100%",
            border: `1px solid ${token.colorText}`
        }} />
    </span>
}

export default Divider;