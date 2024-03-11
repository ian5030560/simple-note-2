import Canvas from "./AddList/canvas";
import Heading from "./AddList/heading";
import Image from "./AddList/image";
import Paragraph from "./AddList/paragraph";
import SpeechToText from "./AddList/speechToText";
import Table from "./AddList/table";
import Code from "./AddList/code";
import { AddItem } from "./Draggable/component";

const ADDLIST: AddItem[] = [
    Paragraph,
    ...Heading,
    Image,
    SpeechToText,
    Canvas,
    Table,
    Code,
];

export default ADDLIST;