import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    OrderedListOutlined,
    UnorderedListOutlined
} from "@ant-design/icons";

const TOOL = [
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

const MARKDOWN = [
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

const ALIGN = [
    {
        key: "left",
        icon: <AlignLeftOutlined />
    },
    {
        key: "center",
        icon: <AlignCenterOutlined />
    },
    {
        key: "right",
        icon: <AlignRightOutlined />
    }
]

const LIST = [
    {
        key: "ordered",
        icon: <OrderedListOutlined />
    },
    {
        key: "unordered",
        icon: <UnorderedListOutlined />
    }
]

const FONT_FAMILY = [
    {
        value: "font-1",
        label: "Font family",
    }
]

export {
    TOOL, 
    MARKDOWN,
    ALIGN,
    LIST,
    FONT_FAMILY
}