import { Button, Flex, theme } from "antd";
import React from "react";

type CheckOptionItem = { key: React.Key, label: React.ReactNode };
interface CheckOptionGroupProps {
    className?: string;
    value?: React.Key;
    items: CheckOptionItem[];
    onChange: (value?: React.Key) => void;
}
export default function CheckOptionGroup(props: CheckOptionGroupProps) {
    const { token } = theme.useToken();

    return <Flex className={props.className} style={{
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadius,
    }}>
        {props.items.map(item => <Button key={item.key} size="small"
            onClick={() => props.onChange(props.value !== item.key ? item.key : undefined)}
            type={props.value === item.key ? "primary" : "text"}
        >{item.label}</Button>)}
    </Flex>
}