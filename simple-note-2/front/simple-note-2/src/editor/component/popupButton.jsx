import React, { useRef } from "react";
import { Button, Popover, Input, Space } from "antd";

const PopupButton = ({ summitButtonProp, buttonProp, onSummit }) => {

    const ref = useRef();

    const content = <Space.Compact>
        <Input ref={ref}/>
        <Button {...summitButtonProp} onClick={() => {
            onSummit?.(ref.current.input.value);
        }}/>
    </Space.Compact>

    return <Popover arrow={false} content={content} trigger={"click"}>
        <Button {...buttonProp} />
    </Popover>
}

export default PopupButton;