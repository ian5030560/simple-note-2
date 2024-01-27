import React from "react"
import OptionGroup, { Option } from "../Basic/option"
import { BoldOutlined, ItalicOutlined, UnderlineOutlined } from "@ant-design/icons"

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
    return <OptionGroup
        options={MARKDOWN}
    />
}

export default Markdown;