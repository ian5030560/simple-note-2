import { FaCamera, FaColumns, FaFileCode, FaPaintBrush, FaTable } from "react-icons/fa";
import { PlusItem } from "./plugins/draggablePlugin/component";
import { FunctionOutlined } from "@ant-design/icons";
import { AiOutlinePicture } from "react-icons/ai";
import { BsTypeH1, BsTypeH2, BsTypeH3, BsTypeH4, BsTypeH5, BsTypeH6, BsParagraph } from "react-icons/bs";
import { IoDocumentText } from "react-icons/io5";
import { MdOndemandVideo } from "react-icons/md";

const heading = [
    {
        value: "h1",
        label: "標題一",
        icon: <BsTypeH1 size={24} />,
    },
    {
        value: "h2",
        label: "標題二",
        icon: <BsTypeH2 size={24} />,
    },
    {
        value: "h3",
        label: "標題三",
        icon: <BsTypeH3 size={24} />,
    },
    {
        value: "h4",
        label: "標題四",
        icon: <BsTypeH4 size={24} />,
    },
    {
        value: "h5",
        label: "標題五",
        icon: <BsTypeH5 size={24} />,
    },
    {
        value: "h6",
        label: "標題六",
        icon: <BsTypeH6 size={24} />,
    },
]

export default [
    {
        value: "paragraph",
        label: "段落",
        icon: <BsParagraph size={24} />,
    },
    ...heading,
    {
        value: "code",
        label: "程式碼",
        icon: <FaFileCode size={24} />,
    },
    {
        value: "math",
        label: "數學公式",
        icon: <FunctionOutlined style={{ fontSize: 24 }} />,
    },
    {
        value: "image",
        label: "圖片",
        icon: <AiOutlinePicture size={24} />,
    },
    {
        value: "table",
        label: "標格",
        icon: <FaTable size={24}/>,
    },
    {
        value: "column",
        label: "欄",
        icon: <FaColumns size={24} />,
    },
    {
        value: "canvas",
        label: "畫布",
        icon: <FaPaintBrush size={24} />,
    },
    {
        value: "video",
        label: "影片",
        icon: <MdOndemandVideo size={24}/>,
    },
    {
        value: "document",
        label: "文件",
        icon: <IoDocumentText size={24} />,
    },
    {
        value: "imageToText",
        label: "圖文識別",
        icon: <FaCamera size={24} />,
    },
] as PlusItem[];