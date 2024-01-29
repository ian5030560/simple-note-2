import React from "react";
import {Button,Flex} from "antd";

export type Option = {
    key: string,
    icon: React.ReactNode,
    style?: React.CSSProperties,
    label?: React.ReactNode,
}

export interface OptionGroupProp {
    options: Option[],
    vertical?: boolean,
    onClick?: (key: string) => void,
    select?: (key: string) => boolean,
}
const OptionGroup: React.FC<OptionGroupProp> = ({ options, vertical, onClick, select }) => {

    return <Flex vertical={vertical} gap={"small"}>
        {
            options.map(option => {

                return <Button
                    key={option.key}
                    type={select?.(option.key) ? "primary" : "text"}
                    icon={option.icon}
                    style={option.style}
                    onClick={() => onClick?.(option.key)}>
                    {option.label}
                </Button>
            })
        }
    </Flex>
}

export default OptionGroup;