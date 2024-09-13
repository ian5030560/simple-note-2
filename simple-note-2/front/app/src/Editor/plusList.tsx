import Canvas from "./PlusList/canvas";
import Heading from "./PlusList/heading";
import Image from "./PlusList/image";
import Paragraph from "./PlusList/paragraph";
import Table from "./PlusList/table";
import Code from "./PlusList/code";
import { PlusItem } from "./Draggable/component";
import ImageToText from "./PlusList/imageToText";
import Video from "./PlusList/video";
import Document from "./PlusList/document";
import Column from "./PlusList/column";
import Math from "./PlusList/math";

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