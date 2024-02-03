import React, { useState } from "react";
import { ColorButton } from "../Basic/button";
import { FontColorsOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useSelectionListener } from "../Hooks";
import { $getSelection, $isTextNode } from "lexical";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";

const FontColor: React.FC = () => {

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
        icon={<FontColorsOutlined />}
        style={{color: current ? current : undefined}}
    />
}

export default FontColor;