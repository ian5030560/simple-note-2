import React from "react";
import { ColorButton } from "../Basic/button";
import { FontColorsOutlined } from "@ant-design/icons";

const FontColor: React.FC = () => {
    return <ColorButton
        colorPickerProp={{
            presets: [
                {
                    label: 'Recommend',
                    colors: [
                        "red", "yellow", "green", "blue", "white"
                    ],
                    defaultOpen: true
                }
            ],
        }}
        icon={<FontColorsOutlined />}
    />
}

export default FontColor;