import React, { useState } from "react";
import { ColorButton } from "../UI/button";
import { HighlightOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useSelectionListener } from "../Hooks";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { $getSelection, $isTextNode } from "lexical";

const BackgroundColor: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const [current, setCurrent] = useState<string | null>(null);

    useSelectionListener((selection) => {
        let bg = $getSelectionStyleValueForProperty(selection, "background-color");
        setCurrent(() => bg ? bg : null);
    }, 1);

    return <ColorButton
        colorPickerProp={{
            presets: [
                {
                    label: 'Recommend',
                    colors: ["red", "yellow", "green", "blue"],
                    defaultOpen: true
                }
            ],
            onChange: (_, hex) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if (!selection) return;

                    const node = selection.getNodes()[0];
                    if (!$isTextNode(node)) return;

                    $patchStyleText(selection, {"background-color": hex === current ? null : hex});

                })
            }
        }}

        icon={<HighlightOutlined />}
        style={{color: current ? current : undefined}}
    />
}

export default BackgroundColor;