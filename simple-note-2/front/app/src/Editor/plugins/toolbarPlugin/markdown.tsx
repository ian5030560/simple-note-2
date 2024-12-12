import { useState } from "react"
import OptionButtonGroup, { Option } from "./ui/optionButtonGroup"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isRangeSelection, FORMAT_TEXT_COMMAND, TextFormatType } from "lexical"
import useSelectionListener from "./useSelectionListener"
import { TypeBold, TypeItalic, TypeUnderline, CodeSlash, Subscript, Superscript } from "react-bootstrap-icons"

const size = 16;
const options: Option[] = [
    {
        key: "bold",
        icon: <TypeBold size={size}/>
    },
    {
        key: "italic",
        icon: <TypeItalic size={size}/>
    },
    {
        key: "underline",
        icon: <TypeUnderline size={size}/>
    },
    {
        key: "code",
        icon: <CodeSlash size={size}/>,
    },
    {
        key: "subscript",
        icon: <Subscript size={size}/>
    },
    {
        key: "superscript",
        icon: <Superscript size={size}/>
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