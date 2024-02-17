import Heading from "./AddList/heading";
import Image from "./AddList/image";
import Paragraph from "./AddList/paragraph";
import { AddItem } from "./Lexical/draggable/component";

const ADDLIST: AddItem[] = [
    Paragraph,
    ...Heading,
    Image,
];

export default ADDLIST;