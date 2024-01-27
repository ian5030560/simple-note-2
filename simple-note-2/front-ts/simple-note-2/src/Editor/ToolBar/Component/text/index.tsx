import React from "react";
import { Select } from "antd";

const TEXT = [
    {
        value: "paragraph",
        label: "Paragraph",
    },
    {
        value: "h1",
        label: "H1",
    },
    {
        value: "h2",
        label: "H2",
    },
    {
        value: "h3",
        label: "H3",
    },
    {
        value: "h4",
        label: "H4",
    },
    {
        value: "h5",
        label: "H5",
    },
    {
        value: "h6",
        label: "H6",
    }
]

const Text: React.FC = () => {
    return <Select options={TEXT}
        onChange={value => {}}
    />
}

export default Text;