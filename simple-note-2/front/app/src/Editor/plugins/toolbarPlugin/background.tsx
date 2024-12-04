import { useCallback, useState } from "react";
import ColorPickerButton from "./ui/colorPickerButton";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText, $getSelectionStyleValueForProperty } from "@lexical/selection";
import { $getSelection, $isRangeSelection } from "lexical";
import useSelectionListener from "./useSelectionListener";
import { BgColorsOutlined } from "@ant-design/icons";

export default function Background() {

    const [editor] = useLexicalComposerContext();
    const [color, setColor] = useState<string | null>(null);

    useSelectionListener((selection) => {
        if ($isRangeSelection(selection)) {
            const bg = $getSelectionStyleValueForProperty(selection, "background-color");
            setColor(bg ? bg : null);
        }
        return false;
    }, 1);

    const $updateColor = useCallback((color: string | null) => {
        const selection = $getSelection();
        if (!selection) return;
        $patchStyleText(selection, { "background-color": color });
    }, []);

    return <ColorPickerButton icon={<BgColorsOutlined />} value={color ?? undefined}
        onRemove={() => editor.update(() => $updateColor(null))}
        onChange={(hex) => editor.update(() => $updateColor(hex === color ? null : hex))} />
}