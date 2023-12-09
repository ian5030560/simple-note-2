import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Affix,
    Button,
    theme,
    ColorPicker,
    InputNumber,
    Select,
    Radio,
    Flex
} from "antd";
import {
    UndoOutlined,
    RedoOutlined,
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    StrikethroughOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    OrderedListOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import { Format } from "../helper/helper";
import { useSlate } from "slate-react";

const Toolbar = () => {

    return <Affix
        style={{
            marginBottom: "5px",
            minWidth: "100%",
        }}>
        <Index />
    </Affix>
}


const ToolDivider = () => <span
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
        padding: "8px"
    }}>
    <div style={{
        minHeight: "100%",
        border: "1px solid black"
    }} />
</span>

const OptionGroup = ({ options, vertical, editor }) => {

    return <Flex vertical={vertical} gap={"small"}>
        {
            options.map(option => {

                return <Button
                    key={option.key}
                    type={Format.Helper.isActive(editor, option.key) ? "primary" : "text"}
                    icon={option.icon}
                    style={option.style}
                    onClick={(e) => {
                        e.preventDefault();
                        Format.Helper.toggleMark(editor, option.key)
                    }}>
                    {option.label}
                </Button>
            })
        }
    </Flex>
}

/**
 * 
 * @param {{editor: Editor}} param0 
 */
const Index = () => {

    const { token } = theme.useToken();
    const editor = useSlate();

    return <div
        style={{
            padding: "3px",
            backgroundColor: token.colorBgBase,
            boxShadow: "2px 2px 2px black",
            display: "flex",
            borderRadius: "0px 0px 8px 8px"
        }}>

        <Button type="text" icon={<UndoOutlined />} />
        <Button type="text" icon={<RedoOutlined />} />

        <ToolDivider />

        <OptionGroup
            editor={editor}
            options={[
                {
                    key: "bold",
                    icon: <BoldOutlined />
                },
                {
                    key: "italic",
                    icon: <ItalicOutlined />
                },
                {
                    key: "underline",
                    icon: <UnderlineOutlined />
                },
                {
                    key: "strikethrough",
                    icon: <StrikethroughOutlined />
                }
            ]}
        />

        <ToolDivider />

        <Radio.Group buttonStyle="solid" style={{ borderRadius: "0px" }}>
            <Radio.Button value={"left"}>{<AlignLeftOutlined />}</Radio.Button>
            <Radio.Button value={"center"}>{<AlignCenterOutlined />}</Radio.Button>
            <Radio.Button value={"right"}>{<AlignRightOutlined />}</Radio.Button>
        </Radio.Group>

        <ToolDivider />

        <Select defaultValue={"font-1"} options={[
            {
                value: "font-1",
                label: "Font family",
            }
        ]} />
        <InputNumber defaultValue={12} />
        <ColorPicker defaultValue={"black"} />

        <ToolDivider />

        <Radio.Group buttonStyle="solid">
            <Radio.Button value={"ordered"}><OrderedListOutlined /></Radio.Button>
            <Radio.Button value={"unordered"}><UnorderedListOutlined /></Radio.Button>
        </Radio.Group>

    </div>
}

export default Toolbar;