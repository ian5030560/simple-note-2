import Paragraph from "./paragraph/index";
import List from "./list/index";
import { H1, H2, H3, H4, H5, H6 } from "./tiitle";

export const ELEMENTS = {
    "paragraph": Paragraph,
    "ordered": List.Ordered,
    "unordered": List.Unordered,
    "list-item": List.Item,
    "h1": H1,
    "h2": H2,
    "h3": H3,
    "h4": H4,
    "h5": H5,
    "h6": H6,
}