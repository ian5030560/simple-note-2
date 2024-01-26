import React, { useRef } from "react";
import { Button, Popover, Input, Space, ColorPicker } from "antd";

export const PopupButton = ({ summitButtonProp, buttonProp, onSummit, search, onChange }) => {

    const ref = useRef();

    const content = <Space.Compact>
        <Input ref={ref} allowClear onChange={onChange} />
        <Button {...summitButtonProp} onClick={() => {
            onSummit?.(ref.current.input.value);
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

export const ColorButton = ({colorPickerProp, buttonProp}) => {

    return <ColorPicker {...colorPickerProp}>
        <Button {...buttonProp} type="text"/>
    </ColorPicker>
}