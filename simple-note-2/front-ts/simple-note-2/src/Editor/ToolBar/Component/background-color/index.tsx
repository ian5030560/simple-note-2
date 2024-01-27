import React from "react";
import { ColorButton } from "../Basic/button";
import { HighlightOutlined } from "@ant-design/icons";

const BackgroundColor = () => {
    return <ColorButton
        colorPickerProp={{
            presets: [
                {
                    label: 'Recommend',
                    colors: [
                        "red", "yellow", "green", "blue"
                    ],
                    defaultOpen: true
                }
            ],
        }}
        
        icon={<HighlightOutlined/>}
    />
}

export default BackgroundColor;