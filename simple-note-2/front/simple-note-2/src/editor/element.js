import Paragraph from "./paragraph/index";
import List from "./list/index";
import Title from "./tiitle";

export const ELEMENTS = {
    "paragraph": Paragraph,
    "ordered": List.Ordered,
    "unordered": List.Unordered,
    "list-item": List.Item,
    "h1": Title.h1,
    "h2": Title.h2,
    "h3": Title.h3,
    "h4": Title.h3,
    "h5": Title.h5,
    "h6": Title.h6,
}