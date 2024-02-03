import { Select } from "antd";
import React, { useState } from "react";
import FONT_FAMILY, { DEFAULT } from "./family";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useSelectionListener } from "../Hooks";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";


const FontFamily: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    const [family, setFamily] = useState<string | null>();

    useSelectionListener((selection) => {
        const node = selection.getNodes()[0];
        if (!$isTextNode(node)) return;

        let f = $getSelectionStyleValueForProperty(selection, "font-family", DEFAULT);
        setFamily(() => f);
    }, 1)

    return <Select
        showSearch
        options={FONT_FAMILY}
        popupMatchSelectWidth={false}
        value={family}
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

export default FontFamily;