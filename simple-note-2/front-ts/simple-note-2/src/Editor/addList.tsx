import Canvas from "./AddList/canvas";
import Heading from "./AddList/heading";
import Image from "./AddList/image";
import Paragraph from "./AddList/paragraph";
import SpeechToText from "./AddList/speechToText";
import { AddItem } from "./Lexical/draggable/component";

const ADDLIST: AddItem[] = [
    Paragraph,
    ...Heading,
    Image,
    SpeechToText,
    Canvas,
];

export default ADDLIST;