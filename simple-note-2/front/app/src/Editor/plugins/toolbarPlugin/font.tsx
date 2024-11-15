import React, { useCallback, useState } from "react";
import ColorPickerButton from "./ui/colorPickerButton";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useSelectionListener from "./useSelectionListener";
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { InputNumber, Select } from "antd";
import FONT_FAMILY, { DEFAULT } from "./fontFamily";
import { Highlighter } from "react-bootstrap-icons";

export const FontColor: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const [value, setValue] = useState<string | null>(null);

    useSelectionListener((selection) => {
        if ($isRangeSelection(selection)) {
            const fc = $getSelectionStyleValueForProperty(selection, "color");
            setValue(fc);
        }
        return false;
    }, 1);

    const $updateColor = useCallback((color: string | null) => {
        const selection = $getSelection();
        if (!selection) return;
        $patchStyleText(selection, { "color": color });
    }, []);
    
    return <ColorPickerButton icon={<Highlighter size={16} />} value={value ?? undefined}
        onRemove={() => editor.update(() => $updateColor(null))}
        onChange={(hex) => editor.update(() => $updateColor(hex === value ? null : hex))} />
}


export const FontFamily: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [family, setFamily] = useState<string | null>();

    useSelectionListener((selection) => {
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            if ($isTextNode(node)) {
                const f = $getSelectionStyleValueForProperty(selection, "font-family", DEFAULT);
                setFamily(() => f);
            }
        }
        return false;
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
        if ($isRangeSelection(selection)) {
            const v = $getSelectionStyleValueForProperty(selection, "font-size", `${SIZE.DEFAULT}px`);
            const result = parseInt(v.replace("px", ""));
            setValue(() => Number.isNaN(result) ? SIZE.DEFAULT : result);
        }
        return false;
    }, 1)

    return <InputNumber min={SIZE.MIN} max={SIZE.MAX}
        value={value} variant="filled"
        onChange={(val) => {
            editor.update(() => {
                const selection = $getSelection();
                if (!selection) return;

                const node = selection.getNodes()[0];
                if (!$isTextNode(node)) return;

                $patchStyleText(selection, { "font-size": `${val}px` })

                if (!val) setValue(() => SIZE.DEFAULT);
                else setValue(() => val);
            })
        }}
    />
}