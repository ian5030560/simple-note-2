import React from "react";
import {theme} from "antd";

const Intro = () => {
    const {token} = theme.useToken();

    return <div style={{minHeight: "85%", backgroundColor: token.colorBgBase}}></div>
}

export default Intro