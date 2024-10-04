import React, { useState } from "react"
import OptionGroup, { Option } from "./UI/option"
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from "@ant-design/icons"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { FORMAT_TEXT_COMMAND, TextFormatType } from "lexical"
import useSelectionListener from "./useSelectionListener"
import { FaCode } from "react-icons/fa";

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
    },
    {
        key: "code",
        icon: <FaCode />,
    }
]

const Markdown: React.FC = () => {

    const [editor] = useLexicalComposerContext();
    const [current, setCurrent] = useState<string[]>([]);

    useSelectionListener((selection) => {
        
        if(!selection) return;

        const marks: string[] = [];
        for (const { key } of MARKDOWN) {

            if (selection.hasFormat(key as TextFormatType)) {
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