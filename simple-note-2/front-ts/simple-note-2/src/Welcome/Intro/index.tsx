import React from "react";
import { theme } from "antd";

const Intro = () => {
    const { token } = theme.useToken();
    const style: React.CSSProperties = {
        minHeight: "85%",
        backgroundColor: token.colorBgBase
    }

    return <div style={style}></div>
}

export default Intro