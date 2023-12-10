import ParagraphElement from "./paragraph/index";
import List from "./list/index";
// import ImageElement from "./element/image";

export const ELEMENTS = {
    "paragraph": ParagraphElement,
    "ordered": List.Ordered,
    "unordered": List.Unordered,
    "item": List.Item
    // "image": ImageElement,
}