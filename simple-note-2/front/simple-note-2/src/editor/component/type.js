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
import {Typography} from "antd";

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

const {Text} = Typography;
const FontLabel = ({family}) => {
    return <Text style={{fontFamily: family}}>{family}</Text>
}

const FONT_FAMILY = [
    {
        value: "initial",
        label: <FontLabel family={"default"}/>,
    },
    {
        value: "Arial, sans-serif",
        label: <FontLabel family={"Arial, sans-serif"}/>,
    },
    {
        value: "Helvetica, sans-serif",
        label: <FontLabel family={"Helvetica, sans-serif"}/>
    },
    {
        value: "Verdana, sans-serif",
        label: <FontLabel family={"Verdana, sans-serif"}/>
    },
    {
        value: "Trebuchet MS, sans-serif",
        label: <FontLabel family={"Trebuchet MS, sans-serif"}/>
    },
    {
        value: "Gill Sans, sans-serif",
        label: <FontLabel family={"Gill Sans, sans-serif"}/>
    },
    {
        value: "Noto Sans, sans-serif",
        label: <FontLabel family={"Noto Sans, sans-serif"}/>
    },
    {
        value: "Optima, sans-serif",
        label: <FontLabel family={"Optima, sans-serif"}/>
    },
    {
        value: "Arial Narrow, sans-serif",
        label: <FontLabel family={"Arial Narrow, sans-serif"}/>
    },
    {
        value: "Times, Times New Roman, serif",
        label: <FontLabel family={"Times, Times New Roman, serif"}/>
    },
    {
        value: "Didot, serif",
        label: <FontLabel family={"Didot, serif"}/>
    },
    {
        value: "Georgia, serif",
        label: <FontLabel family={"Georgia, serif"}/>
    },
    {
        value: "Palatino, URW Palladio L, serif",
        label: <FontLabel family={"Palatino, URW Palladio L, serif"}/>
    },
    {
        value: "Bookman, URW Bookman L, serif",
        label: <FontLabel family={"Bookman, URW Bookman L, serif"}/>
    },
    {
        value: "New Century Schoolbook, TeX Gyre Schola, serif",
        label: <FontLabel family={"New Century Schoolbook, TeX Gyre Schola, serif"}/>
    },
    {
        value: "American Typewriter, serif",
        label: <FontLabel family={"American Typewriter, serif"}/>
    },
    {
        value: "sans-serif",
        label: <FontLabel family={"sans-serif"}/>,
    },
    {
        value: "Andale Mono, monospace",
        label: <FontLabel family={"Andale Mono, monospace"}/>
    },
    {
        value: "Courier New, monospace",
        label: <FontLabel family={"Courier New, monospace"}/>
    },
    {
        value: "Courier, monospace",
        label: <FontLabel family={"Courier, monospace"}/>
    },
    {
        value: "FreeMono, monospace",
        label: <FontLabel family={"FreeMono, monospace"}/>
    },
    {
        value: "OCR A Std, monospace",
        label: <FontLabel family={"OCR A Std, monospace"}/>
    },
    {
        value: "DejaVu Sans Mono, monospace",
        label: <FontLabel family={"DejaVu Sans Mono, monospace"}/>
    },
    {
        value: "monospace",
        label: <FontLabel family={"monospace"}/>
    },
    {
        value: "Impact, fantasy",
        label: <FontLabel family={"Impact, fantasy"}/>
    },
    {
        value: "Luminari, fantasy",
        label: <FontLabel family={"Luminari, fantasy"}/>
    },
    {
        value: "fantasy",
        label: <FontLabel family={"fantasy"}/>
    },
]

const SIZE = [];
for(let i = 8; i <= 72; i += 2){
    SIZE.push({
        value: `${i}`,
        label: `${i}`
    })
}

export {
    TEXT, 
    MARKDOWN,
    ALIGN,
    LIST,
    FONT_FAMILY,
    SIZE
}