import Paragraph, { NextLine } from "./Component/paragraph";
import List from "./Component/list";
import Title from "./Component/tiitle";
import Image from "./Component/image";
import Link from "./Component/link";

export const ELEMENTS = {
    "paragraph": Paragraph,
    "ordered": List.Ordered,
    "unordered": List.Unordered,
    "h1": Title.h1,
    "h2": Title.h2,
    "h3": Title.h3,
    "h4": Title.h3,
    "h5": Title.h5,
    "h6": Title.h6,
    "image": Image,
}

export const INLINE_ELEMENTS = {
    "link": Link,
    "next": NextLine,
}