import React, { useRef, useState } from "react";
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
    FontColorsOutlined,
    HighlightOutlined
} from "@ant-design/icons";
import MarkHelper from "../mark/helper";
import { useSlate } from "slate-react";
import { AlignHelper } from "../paragraph/helper";
import ListHelper from "../list/helper";
import { ALIGN, FONT_FAMILY, LIST, MARKDOWN, SIZE, TEXT } from "./type";
import OptionGroup from "./option";
import TitleHelper from "../tiitle/helper";
import { BgColorHelper, ColorHelper, rgbToHex } from "../color/helper";
import { FamilyHelper, SizeHelper } from "../font/helper";

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
    const colorRef = useRef(rgbToHex(token.colorText));

    let text = "";
    for (let tool of TEXT) {
        if (TitleHelper.isActive(editor, tool.value)) {
            text = tool.value;
            break;
        }
    }

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

        <Select options={TEXT} value={text}
            onChange={value => { TitleHelper.toggleTitle(editor, value); }}
        />

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

        <ColorPicker value={ColorHelper.detectColor(editor)}
            onChange={value => { ColorHelper.changeColor(editor, value.toHexString()) }}
            presets={[
                {
                    label: 'Recommend',
                    colors: [
                        colorRef.current, "red", "yellow", "green", "blue"
                    ],
                    defaultOpen: true
                }
            ]}
        >
            <Button icon={<FontColorsOutlined />} type="text" style={{ color: ColorHelper.detectColor(editor) }} />
        </ColorPicker>

        <ColorPicker value={BgColorHelper.detectColor(editor)}
            onChange={value => { BgColorHelper.changeColor(editor, value.toHexString()) }}
            presets={[
                {
                    label: 'Recommend',
                    colors: [
                        "#ffffff50", "red", "yellow", "green", "blue"
                    ],
                    defaultOpen: true
                }
            ]}
        >
            <Button icon={<HighlightOutlined />}
                type="text"
                style={{ color: BgColorHelper.detectColor(editor) === "#ffffff50" ? rgbToHex(token.colorText) : BgColorHelper.detectColor(editor) }}
            />
        </ColorPicker>

        <InputNumber
            min={8}
            max={72}
            value={SizeHelper.detectSize(editor) === "initial" ? 16 : SizeHelper.detectSize(editor)}
            onChange={value => SizeHelper.changeSize(editor, value)}
        />

        <Select
            showSearch
            value={FamilyHelper.detectFamily(editor)}
            options={FONT_FAMILY}
            popupMatchSelectWidth={false}
            onChange={value => FamilyHelper.changeFamily(editor, value)}
        />
    </div>
}

export default Toolbar;