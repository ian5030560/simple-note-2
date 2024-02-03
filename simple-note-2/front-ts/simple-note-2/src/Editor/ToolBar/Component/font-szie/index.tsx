import { InputNumber } from "antd";
import React, { useState } from "react";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { useSelectionListener } from "../Hooks";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";

enum SIZE {
    MIN = 8,
    MAX = 72,
    DEFAULT = 16
}

const FontSize: React.FC = () => {
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

export default FontSize;