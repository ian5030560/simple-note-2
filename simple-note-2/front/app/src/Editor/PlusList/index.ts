import Canvas from "./canvas";
import Heading from "./heading";
import Image from "./image";
import Paragraph from "./paragraph";
import Table from "./table";
import Code from "./code";
import ImageToText from "./imageToText";
import Video from "./video";
import Document from "./document";
import Column from "./column";
import Math from "./math";
import { PlusItem } from "../Draggable/component";

const PlusList: PlusItem[] = [
    Paragraph,
    ...Heading,
    Image,
    Canvas,
    Table,
    Code,
    ImageToText,
    Video,
    Document,
    Column,
    Math,
];

export default PlusList;