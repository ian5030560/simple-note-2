import { PlusItem } from "./plugins/draggablePlugin/component";
import { Camera, CardImage, CodeSlash, FileText, LayoutThreeColumns, PaletteFill, Paragraph, PersonVideo, PlusSlashMinus, Table, TypeH1, TypeH2, TypeH3, TypeH4, TypeH5, TypeH6 } from "react-bootstrap-icons";

const ICON_SIZE = 24;
const heading = [
    {
        value: "h1",
        label: "標題一",
        icon: <TypeH1 size={ICON_SIZE} />,
    },
    {
        value: "h2",
        label: "標題二",
        icon: <TypeH2 size={ICON_SIZE} />,
    },
    {
        value: "h3",
        label: "標題三",
        icon: <TypeH3 size={ICON_SIZE} />,
    },
    {
        value: "h4",
        label: "標題四",
        icon: <TypeH4 size={ICON_SIZE} />,
    },
    {
        value: "h5",
        label: "標題五",
        icon: <TypeH5 size={ICON_SIZE} />,
    },
    {
        value: "h6",
        label: "標題六",
        icon: <TypeH6 size={ICON_SIZE} />,
    },
]

export default [
    {
        value: "paragraph",
        label: "段落",
        icon: <Paragraph size={ICON_SIZE} />,
    },
    ...heading,
    {
        value: "code",
        label: "程式碼",
        icon: <CodeSlash size={ICON_SIZE}/>
    },
    {
        value: "math",
        label: "數學公式",
        icon: <PlusSlashMinus size={ICON_SIZE} />,
    },
    {
        value: "image",
        label: "圖片",
        icon: <CardImage size={ICON_SIZE} />
    },
    {
        value: "table",
        label: "表格",
        icon: <Table size={ICON_SIZE} />
    },
    {
        value: "column",
        label: "欄",
        icon: <LayoutThreeColumns size={ICON_SIZE} />
    },
    {
        value: "canvas",
        label: "畫布",
        icon: <PaletteFill size={ICON_SIZE} />
    },
    {
        value: "video",
        label: "影片",
        icon: <PersonVideo size={ICON_SIZE} />
    },
    {
        value: "document",
        label: "文件",
        icon: <FileText size={ICON_SIZE} />
    },
    {
        value: "imageToText",
        label: "圖文識別",
        icon: <Camera size={ICON_SIZE} />
    },
] as PlusItem[];