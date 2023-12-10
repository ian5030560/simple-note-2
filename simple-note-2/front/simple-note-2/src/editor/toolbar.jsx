import React from "react";
import {
    Affix,
    Button,
    theme,
    ColorPicker,
    InputNumber,
    Select,
    Flex
} from "antd";
import {
    UndoOutlined,
    RedoOutlined,
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    OrderedListOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";
import MarkHelper from "./mark/helper";
import { useSlate } from "slate-react";
import {AlignHelper} from "./paragraph/helper";
import { OrderHelper } from "./list/helper";

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

const OptionGroup = ({ options, vertical, onClick, onSelect }) => {

    return <Flex vertical={vertical} gap={"small"}>
        {
            options.map(option => {

                return <Button
                    key={option.key}
                    type={onSelect?.(option.key) ? "primary" : "text"}
                    icon={option.icon}
                    style={option.style}
                    onClick={() => onClick?.(option.key)}>
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
                }
            ]}

            onClick={(key) => MarkHelper.toggleMark(editor, key)}
            onSelect={(key) => MarkHelper.isActive(editor, key)}
        />

        <ToolDivider />

        <OptionGroup
            options={[
                {
                    key: "left",
                    icon: <AlignLeftOutlined />
                },
                {
                    key: "center",
                    icon: <AlignCenterOutlined />
                },
                {
                    key: "right",
                    icon: <AlignRightOutlined />
                }
            ]}

            onClick={(key) => AlignHelper.toggleBlock(editor, key)}
            onSelect={(key) => AlignHelper.isActive(editor, key)}
        />

        <ToolDivider />

        <OptionGroup
            options={[
                {
                    key: "ordered",
                    icon: <OrderedListOutlined />
                },
                {
                    key: "unordered",
                    icon: <UnorderedListOutlined />
                }
            ]}

            onClick={(key) => OrderHelper.toggleBlock(editor, key)}
            onSelect={(key) => OrderHelper.isActive(editor, key)}
        />

        <ToolDivider />

        <Select defaultValue={"font-1"} options={[
            {
                value: "font-1",
                label: "Font family",
            }
        ]} />
        <InputNumber defaultValue={12} />
        <ColorPicker defaultValue={"black"} />
    </div>
}

export default Toolbar;