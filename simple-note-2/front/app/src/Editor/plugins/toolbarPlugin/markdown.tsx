import { useState } from "react"
import OptionButtonGroup, { Option } from "./ui/optionButtonGroup"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isRangeSelection, FORMAT_TEXT_COMMAND, TextFormatType } from "lexical"
import useSelectionListener from "./useSelectionListener"
import { CodeSlash, Subscript, Superscript, TypeBold, TypeItalic, TypeUnderline } from "react-bootstrap-icons"

const options: Option[] = [
    {
        key: "bold",
        icon: <TypeBold size={16} />
    },
    {
        key: "italic",
        icon: <TypeItalic size={16} />
    },
    {
        key: "underline",
        icon: <TypeUnderline size={16} />
    },
    {
        key: "code",
        icon: <CodeSlash size={16} />,
    },
    {
        key: "subscript",
        icon: <Subscript size={16} />
    },
    {
        key: "superscript",
        icon: <Superscript size={16} />
    }
]

export default function Markdown() {

    const [editor] = useLexicalComposerContext();
    const [format, setFormat] = useState<TextFormatType[]>([]);

    useSelectionListener((selection) => {
        if ($isRangeSelection(selection)) {
            const marks: TextFormatType[] = [];
            for (const { key } of options) {

                if (selection.hasFormat(key as TextFormatType)) {
                    marks.push(key as TextFormatType)
                }
            }
            setFormat(marks);
        }
        return false;
    }, 1);

    return <OptionButtonGroup value={format} options={options}
        onSelect={(key) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, key as TextFormatType)} />
}