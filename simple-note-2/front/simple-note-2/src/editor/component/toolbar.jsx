import React from "react";
import {
    Affix,
    Button,
    theme,
    ColorPicker,
    InputNumber,
    Select,
} from "antd";
import {
    UndoOutlined,
    RedoOutlined,
} from "@ant-design/icons";
import MarkHelper from "../mark/helper";
import { useSlate } from "slate-react";
import { AlignHelper } from "../paragraph/helper";
import ListHelper from "../list/helper";
import { ALIGN, FONT_FAMILY, LIST, MARKDOWN, TOOL } from "./type";
import OptionGroup from "./option";

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

        <Select defaultValue={"paragraph"} options={TOOL} />

        <ToolDivider />

        <OptionGroup
            options={MARKDOWN}
            onClick={(key) => MarkHelper.toggleMark(editor, key)}
            onSelect={(key) => MarkHelper.isActive(editor, key)}
        />

        <ToolDivider />

        <OptionGroup
            options={ALIGN}
            onClick={(key) => AlignHelper.toggleBlock(editor, key)}
            onSelect={(key) => AlignHelper.isActive(editor, key)}
        />

        <ToolDivider />

        <OptionGroup
            options={LIST}
            onClick={(key) => ListHelper.toggleBlock(editor, key)}
            onSelect={(key) => ListHelper.isActive(editor, key)}
        />

        <ToolDivider />

        <Select defaultValue={"font-1"} options={FONT_FAMILY} />
        <InputNumber defaultValue={12} />
        <ColorPicker defaultValue={"black"} />
    </div>
}

export default Toolbar;