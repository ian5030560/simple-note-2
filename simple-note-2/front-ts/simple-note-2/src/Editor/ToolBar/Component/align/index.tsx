import React from "react";
import OptionGroup, { Option } from "../Basic/option";
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined } from "@ant-design/icons";

const ALIGN: Option[] = [
    {
        key: "left",
        icon: <AlignLeftOutlined />
    },
    {
        key: "center",
        icon: <AlignCenterOutlined />
    },
    {
        key: "right",
        icon: <AlignRightOutlined />
    }
]

const Align: React.FC = () => {
    return <OptionGroup
        options={ALIGN}
    />
}

export default Align;