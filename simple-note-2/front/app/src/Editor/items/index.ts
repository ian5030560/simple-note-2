import { PlusItem } from "../plugins/draggablePlugin/component";
import Canvas from "./canvas";
import Code from "./code";
import Column from "./column";
import Heading from "./heading";
import ImageToText from "./imageToText";
import Paragraph from "./paragraph";
import Table from "./table";
import Video from "./video";
import Math from "./math";
import Image from "./image";
import Document from "./document";

export default [
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
] as PlusItem[];