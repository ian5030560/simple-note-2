import Paragraph from "./Component/paragraph"
import {Unordered, Ordered} from "./Component/list";
import { H1, H2, H3, H4, H5, H6 } from "./Component/title";
import Image from "./Component/image";
import Link from "./Component/link";

const ELEMENT = {
    "paragraph": Paragraph,
    "ordered": Ordered,
    "unordered": Unordered,
    "h1": H1,
    "h2": H2,
    "h3": H3,
    "h4": H4,
    "h5": H5,
    "h6": H6,
    "image": Image,
    "link": Link
}

export default ELEMENT;