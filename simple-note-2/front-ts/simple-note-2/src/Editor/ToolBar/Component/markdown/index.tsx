import React, { useState } from "react"
import OptionGroup, { Option } from "../Basic/option"
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from "@ant-design/icons"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { FORMAT_TEXT_COMMAND, TextFormatType } from "lexical"
import { useSelectionListener } from "../Hooks"

const MARKDOWN: Option[] = [
    {
        key: "bold",
        icon: <BoldOutlined />
    },
    {
        key: "italic",
        icon: <ItalicOutlined />
    },
    {
        key: "underline",
        icon: <UnderlineOutlined />
    }
]

const Markdown: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const [current, setCurrent] = useState<string[]>([]);

    useSelectionListener((selection) => {
        let marks: string[] = [];
        for (let { key } of MARKDOWN) {
            if (selection?.hasFormat(key as TextFormatType)) {
                marks.push(key)
            }
        }
        setCurrent(() => marks);
    }, 1)

    return <OptionGroup
        options={MARKDOWN}
        select={(key) => current.includes(key)}
        onClick={(key) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, key as TextFormatType)}
    />
}

export default Markdown;