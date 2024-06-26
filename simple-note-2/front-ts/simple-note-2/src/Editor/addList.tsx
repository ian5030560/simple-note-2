import Canvas from "./AddList/canvas";
import Heading from "./AddList/heading";
import Image from "./AddList/image";
import Paragraph from "./AddList/paragraph";
import SpeechToText from "./AddList/speechToText";
import Table from "./AddList/table";
import Code from "./AddList/code";
import { AddItem } from "./Draggable/component";
import ImageToText from "./AddList/imageToText";
import Video from "./AddList/video";
import Document from "./AddList/document";
import Column from "./AddList/column";

const ADDLIST: AddItem[] = [
    Paragraph,
    ...Heading,
    Image,
    SpeechToText,
    Canvas,
    Table,
    Code,
    ImageToText,
    Video,
    Document,
    Column,
];

export default ADDLIST;