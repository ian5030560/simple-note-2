import { CameraFilled, FileFilled, FunctionOutlined, TableOutlined } from "@ant-design/icons";
import { PlusItem } from "./plugins/draggablePlugin/component";
import {
    CheckSquare, CodeSquare, FileText, Icon123, Image, ImageAlt, ImageFill,
    LayoutThreeColumns, List, PaletteFill, Paragraph, Percent, PersonVideo, PlusSlashMinus,
    ThreeDotsVertical, Type, TypeH1, TypeH2, TypeH3, TypeH4, TypeH5, TypeH6
} from "react-bootstrap-icons";

export default [
    { key: "paragraph", label: "段落", icon: <Paragraph /> },
    {
        key: "heading", label: "標題", icon: <Type />,
        children: [
            { key: "h1", label: "標題一", icon: <TypeH1 /> },
            { key: "h2", label: "標題二", icon: <TypeH2 /> },
            { key: "h3", label: "標題三", icon: <TypeH3 /> },
            { key: "h4", label: "標題四", icon: <TypeH4 /> },
            { key: "h5", label: "標題五", icon: <TypeH5 /> },
            { key: "h6", label: "標題六", icon: <TypeH6 /> },
        ],
    },
    {
        key: "list", label: "列表", icon: <List />,
        children: [
            { key: "number", label: "有序列表", icon: <Icon123 /> },
            { key: "bullet", label: "無序列表", icon: <ThreeDotsVertical /> },
            { key: "checked", label: "檢查列表", icon: <CheckSquare /> }
        ]
    },
    {
        key: "math", label: "數學", icon: <FunctionOutlined />,
        children: [
            { key: "block", label: "區塊公式", icon: <PlusSlashMinus /> },
            { key: "inline", label: "行內公式", icon: <Percent /> }
        ]
    },
    {
        key: "file", label: "文件", icon: <FileFilled />,
        children: [
            { key: "document", label: "預設", icon: <FileText /> },
            {
                key: "image", label: "圖片", icon: <Image />,
                children: [
                    { key: "block", label: "區塊圖片", icon: <ImageFill /> },
                    { key: "inline", label: "行內圖片", icon: <ImageAlt /> }
                ]
            },
            { key: "video", label: "影片", icon: <PersonVideo /> },

        ]
    },
    { key: "code", label: "程式碼", icon: <CodeSquare /> },
    { key: "table", label: "表格", icon: <TableOutlined /> },
    { key: "column", label: "欄", icon: <LayoutThreeColumns /> },
    { key: "canvas", label: "畫布", icon: <PaletteFill /> },
    { key: "imageToText", label: "圖文識別", icon: <CameraFilled /> },
] as PlusItem[];