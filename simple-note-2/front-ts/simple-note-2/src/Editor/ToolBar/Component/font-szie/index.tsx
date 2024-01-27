import { InputNumber } from "antd";
import React from "react";

const FontSize: React.FC = () => {
    return <InputNumber
        min={8}
        max={72}
    />
}

export default FontSize;