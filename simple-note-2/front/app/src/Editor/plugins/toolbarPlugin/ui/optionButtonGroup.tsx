import React, { useCallback } from "react";
import { Button, Flex } from "antd";

export type Option = {
    key: string;
    icon: React.ReactNode;
}

export interface OptionButtonGroupProps {
    options: Option[];
    value?: string | string[];
    onSelect: (key: string) => void;
}
export default function OptionButtonGroup(props: OptionButtonGroupProps) {

    const isSelected = useCallback((key: string) => {
        if(Array.isArray(props.value)){
            return props.value.includes(key);
        }

        return props.value === key;
    }, [props.value]);

    return <Flex gap={"small"}>
        {
            props.options.map(option => <Button key={option.key} icon={option.icon}
                onClick={() => props.onSelect(option.key)}
                type={isSelected(option.key) ? "primary" : "text"} />)
        }
    </Flex>
}