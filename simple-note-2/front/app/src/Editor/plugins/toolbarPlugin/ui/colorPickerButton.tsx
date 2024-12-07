import React from "react";
import { Button, ColorPicker, ColorPickerProps, Space } from "antd";
import {red, yellow, green, blue, presetPalettes} from "@ant-design/colors";
import { CloseOutlined } from "@ant-design/icons";

type Presets = Required<ColorPickerProps>['presets'][number];

const genPresets = (presets = presetPalettes) => Object.entries(presets).map<Presets>(([label, colors]) => ({ label, colors }));

export interface ColorPickerButtonProps{
    value: React.CSSProperties["color"];
    icon: React.ReactNode;
    onChange: (color: string) => void;
    onRemove: () => void;
}
export default function ColorPickerButton(props: ColorPickerButtonProps){

    const panelRender: ColorPickerProps["panelRender"] = (_, {components: {Picker, Presets}}) => <Space direction="vertical">
        <div><Picker/></div>
        <Space direction="vertical">
            <Presets/>
            <Button icon={<CloseOutlined />} block onClick={props.onRemove}>移除</Button>
        </Space>
    </Space>

    return <ColorPicker value={props.value} onChange={(_, hex) => props.onChange(hex)} panelRender={panelRender}
        presets={genPresets({red, yellow, green, blue})}>
        <Button type="text" icon={props.icon} style={{color: props.value}}/>
    </ColorPicker>
}