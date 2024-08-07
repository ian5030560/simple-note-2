import React, { useState } from "react";
import { ColorButton } from "../UI/button";
import { FontColorsOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useSelectionListener } from "../Hooks";
import { $getSelection, $isTextNode } from "lexical";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { InputNumber, Select } from "antd";
import FONT_FAMILY, { DEFAULT } from "./family";

export const FontColor: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const [current, setCurrent] = useState<string | null>(null);

    useSelectionListener((selection) => {
        let fc = $getSelectionStyleValueForProperty(selection, "color");
        setCurrent(() => fc ? fc : null);
    }, 1);

    return <ColorButton
        colorPickerProp={{
            presets: [
                {
                    label: 'Recommend',
                    colors: [
                        "red", "yellow", "green", "blue", "white"
                    ],
                    defaultOpen: true
                }
            ],

            onChange: (_, hex) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if (!selection) return;

                    const node = selection.getNodes()[0];
                    if (!$isTextNode(node)) return;

                    $patchStyleText(selection, {"color": hex === current ? null : hex});
                })
            }
        }}
        icon={<FontColorsOutlined size={24}/>}
        style={{color: current ? current : undefined}}
    />
}


export const FontFamily: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [family, setFamily] = useState<string | null>();

    useSelectionListener((selection) => {
        const node = selection.getNodes()[0];
        if (!$isTextNode(node)) return;

        let f = $getSelectionStyleValueForProperty(selection, "font-family", DEFAULT);
        setFamily(() => f);
    }, 1)

    return <Select showSearch options={FONT_FAMILY}
        popupMatchSelectWidth={false} value={family}
        onChange={(value) => {
            editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;

                const node = selection.getNodes()[0];
                if (!$isTextNode(node)) return;

                $patchStyleText(selection, { "font-family": value });
                setFamily(() => value);
            })
        }}
    />
}


enum SIZE {
    MIN = 8,
    MAX = 72,
    DEFAULT = 16
}

export const FontSize: React.FC = () => {
    const [value, setValue] = useState<number>(SIZE.DEFAULT);
    const [editor] = useLexicalComposerContext();

    useSelectionListener((selection) => {
        let v = $getSelectionStyleValueForProperty(selection, "font-size", `${SIZE.DEFAULT}px`);
        let result = parseInt(v.replace("px", ""));
        setValue(() => Number.isNaN(result) ? SIZE.DEFAULT : result);
    }, 1)

    return <InputNumber
        min={SIZE.MIN}
        max={SIZE.MAX}
        value={value}
        variant="filled"
        onChange={(val) => {
            editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;

                const node = selection.getNodes()[0];
                if (!$isTextNode(node)) return;

                $patchStyleText(selection, {
                    "font-size": `${val}px`,
                })

                if (!val) setValue(() => SIZE.DEFAULT);
                else setValue(() => val);
            })
        }}
    />
}