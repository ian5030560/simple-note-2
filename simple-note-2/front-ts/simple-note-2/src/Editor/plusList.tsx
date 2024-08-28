import Canvas from "./PlusList/canvas";
import Heading from "./PlusList/heading";
import Image from "./PlusList/image";
import Paragraph from "./PlusList/paragraph";
// import SpeechToText from "./PlusList/speechToText";
import Table from "./PlusList/table";
import Code from "./PlusList/code";
import { PlusItem } from "./Draggable/component";
import ImageToText from "./PlusList/imageToText";
import Video from "./PlusList/video";
import Document from "./PlusList/document";
import Column from "./PlusList/column";

const PlusList: PlusItem[] = [
    Paragraph,
    ...Heading,
    Image,
    // SpeechToText,
    Canvas,
    Table,
    Code,
    ImageToText,
    Video,
    Document,
    Column,
];

export default PlusList;