import { Select } from "antd";
import React from "react";
import FONT_FAMILY from "./family";

const FontFamily: React.FC = () => {
    return <Select
        showSearch
        options={FONT_FAMILY}
        popupMatchSelectWidth={false}
    />
}

export default FontFamily;