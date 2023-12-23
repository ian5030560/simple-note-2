import React from "react";
import {
    Affix,
    Button,
    theme,
    InputNumber,
    Select,
} from "antd";
import {
    UndoOutlined,
    RedoOutlined,
    FontColorsOutlined,
    HighlightOutlined,
    LinkOutlined,
    SearchOutlined
} from "@ant-design/icons";
import MarkHelper from "../slate/mark/helper";
import { useSlate } from "slate-react";
import { AlignHelper } from "../slate/paragraph/helper";
import ListHelper from "../slate/list/helper";
import { ALIGN, FONT_FAMILY, LIST, MARKDOWN, TEXT } from "./list";
import OptionGroup from "./option";
import TitleHelper from "../slate/tiitle/helper";
import { BgColorHelper, ColorHelper, rgbToHex } from "../slate/color/helper";
import { FamilyHelper, SizeHelper } from "../slate/font/helper";
import LinkHelper from "../slate/link/helper";
import { PopupButton, ColorButton } from "./button";

const Toolbar = ({ onSearch }) => {

    return <Affix
        style={{
            marginBottom: "5px",
            minWidth: "100%",
        }}>
        <Index onSearch={onSearch} />
    </Affix>
}

const ToolDivider = () => {

    const { token } = theme.useToken();

    return <span
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100%",
            padding: "8px"
        }}>
        <div style={{
            minHeight: "100%",
            border: `1px solid ${token.colorText}`
        }} />
    </span>
}

/**
 * 
 * @param {{editor: Editor}} param0 
 */
const Index = ({ onSearch }) => {

    const { token } = theme.useToken();
    const editor = useSlate();

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
            boxShadow: "0px 1px 16px 0px",
            display: "flex",
            borderRadius: "0px 0px 8px 8px",
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

        <ColorButton
            colorPickerProp={{
                value: ColorHelper.detectColor(editor) ? ColorHelper.detectColor(editor) : token.colorText,
                presets: [
                    {
                        label: 'Recommend',
                        colors: [
                            "red", "yellow", "green", "blue", "white"
                        ],
                        defaultOpen: true
                    }
                ],
                onChange: value => { ColorHelper.changeColor(editor, value.toHexString()) }
            }}
            buttonProp={{
                icon: <FontColorsOutlined />,
                style: { color: ColorHelper.detectColor(editor) ? ColorHelper.detectColor(editor) : rgbToHex(token.colorText) }
            }}
        />

        <ColorButton
            colorPickerProp={{
                value: BgColorHelper.detectColor(editor) ? BgColorHelper.detectColor(editor) : rgbToHex(token.colorText),
                presets: [
                    {
                        label: 'Recommend',
                        colors: [
                            "red", "yellow", "green", "blue"
                        ],
                        defaultOpen: true
                    }
                ],
                onChange: value => { BgColorHelper.changeColor(editor, value.toHexString()) }
            }}
            buttonProp={{
                icon: <HighlightOutlined />,
                style: {color: BgColorHelper.detectColor(editor) ? BgColorHelper.detectColor(editor) : rgbToHex(token.colorText) }
            }}
        />

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

        <ToolDivider />

        <PopupButton
            buttonProp={{
                icon: <LinkOutlined />,
                type: "text"
            }}

            summitButtonProp={{
                type: "primary",
                children: "嵌入"
            }}

            onSummit={(value) => {
                LinkHelper.toggleLink(editor, value)
            }}
        />

        <PopupButton
            buttonProp={{
                icon: <SearchOutlined />,
                type: "text",
            }}
            search={true}
            onChange={onSearch}
        />
    </div>
}

export default Toolbar;