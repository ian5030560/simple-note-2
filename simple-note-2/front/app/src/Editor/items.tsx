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
        label: "H1",
        icon: <BsTypeH1 size={24} />,
    },
    {
        value: "h2",
        label: "H2",
        icon: <BsTypeH2 size={24} />,
    },
    {
        value: "h3",
        label: "H3",
        icon: <BsTypeH3 size={24} />,
    },
    {
        value: "h4",
        label: "H4",
        icon: <BsTypeH4 size={24} />,
    },
    {
        value: "h5",
        label: "H5",
        icon: <BsTypeH5 size={24} />,
    },
    {
        value: "h6",
        label: "H6",
        icon: <BsTypeH6 size={24} />,
    },
]

export default [
    {
        value: "paragraph",
        label: "Paragraph",
        icon: <BsParagraph size={24} />,
    },
    ...heading,
    {
        value: "code",
        label: "Code",
        icon: <FaFileCode size={24} />,
    },
    {
        value: "math",
        label: "Math",
        icon: <FunctionOutlined style={{ fontSize: 24 }} />,
    },
    {
        value: "image",
        label: "Image",
        icon: <AiOutlinePicture size={24} />,
    },
    {
        value: "table",
        label: "Table",
        icon: <FaTable size={24}/>,
    },
    {
        value: "column",
        label: "Column",
        icon: <FaColumns size={24} />,
    },
    {
        value: "canvas",
        label: "Canvas",
        icon: <FaPaintBrush size={24} />,
    },
    {
        value: "video",
        label: "Video",
        icon: <MdOndemandVideo size={24}/>,
    },
    {
        value: "document",
        label: "Document",
        icon: <IoDocumentText size={24} />,
    },
    {
        value: "imageToText",
        label: "Image To Text",
        icon: <FaCamera size={24} />,
    },
] as PlusItem[];