import { FunctionOutlined } from "@ant-design/icons";
import { PlusItem } from "./plugins/draggablePlugin/component";
import { Camera, CardImage, CodeSquare, FileText, LayoutThreeColumns, PaletteFill, Paragraph, Percent, PersonVideo, PlusSlashMinus, Table, Type, TypeH1, TypeH2, TypeH3, TypeH4, TypeH5, TypeH6 } from "react-bootstrap-icons";

export default [
    {
        key: "paragraph",
        label: "段落",
        icon: <Paragraph />,
    },
    {
        key: "heading",
        label: "標題",
        icon: <Type />,
        children: [
            { key: "h1", label: "標題一", icon: <TypeH1 /> },
            { key: "h2", label: "標題二", icon: <TypeH2 /> },
            { key: "h3", label: "標題三", icon: <TypeH3 /> },
            { key: "h4", label: "標題四", icon: <TypeH4 /> },
            { key: "h5", label: "標題五", icon: <TypeH5 /> },
            { key: "h6", label: "標題六", icon: <TypeH6 /> },
        ],
    },
    { key: "code", label: "程式碼", icon: <CodeSquare /> },
    {
        key: "math", label: "數學公式", icon: <FunctionOutlined />,
        children: [
            { key: "block-math", label: "區塊", icon: <PlusSlashMinus /> },
            { key: "inline-math", label: "行內", icon: <Percent /> }
        ]
    },
    {
        key: "image",
        label: "圖片",
        icon: <CardImage />
    },
    {
        key: "table",
        label: "表格",
        icon: <Table />
    },
    {
        key: "column",
        label: "欄",
        icon: <LayoutThreeColumns />
    },
    {
        key: "canvas",
        label: "畫布",
        icon: <PaletteFill />
    },
    {
        key: "video",
        label: "影片",
        icon: <PersonVideo />
    },
    {
        key: "document",
        label: "文件",
        icon: <FileText />
    },
    {
        key: "imageToText",
        label: "圖文識別",
        icon: <Camera />
    },
] as PlusItem[];