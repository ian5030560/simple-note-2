import React, { useRef } from "react";
import { Button, Popover, Input, Space, ColorPicker, ButtonProps, InputRef, ColorPickerProps } from "antd";

export interface PopupButtonProp extends Omit<ButtonProps, "onChange">{
    summitButton?: ButtonProps,  
    onSummit?: (text?: string) => void, 
    search?: boolean, 
    onChange?: (value: string) => void,
}
export const PopupButton: React.FC<PopupButtonProp> = ({ summitButton, onSummit, search, onChange, ...buttonProp }) => {

    const ref = useRef<InputRef | null>(null);

    const content = <Space.Compact>
        <Input ref={ref} allowClear onChange={(e) => onChange?.(e.target.value)} />
        <Button {...summitButton} onClick={() => {
            onSummit?.(ref.current!.input!.value);
            ref.current!.input!.value = "";
        }} />
    </Space.Compact>

    const searchContent = <Input
        ref={ref}
        allowClear
        onChange={(e) => onChange?.(e.target.value)}
        type="search" />

    return <Popover
        arrow={false}
        content={search ? searchContent : content}
        trigger={"click"}>
        <Button {...buttonProp} />
    </Popover>
}


export interface ColorButtonProp extends Omit<ButtonProps, "onChange">{
    colorPickerProp: ColorPickerProps
}
export const ColorButton: React.FC<ColorButtonProp> = ({colorPickerProp, ...buttonProp}) => {

    return <ColorPicker {...colorPickerProp}>
        <Button {...buttonProp} type="text"/>
    </ColorPicker>
}