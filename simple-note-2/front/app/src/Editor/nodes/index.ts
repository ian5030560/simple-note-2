import CanvasNode from "./canvas";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import ColumnContainerNode from "./column/container";
import ColumnItemNode from "./column/item";
import DocumentNode from "./document";
import ImageNode from "./image";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import VideoNode from "./video";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MarkNode } from "@lexical/mark";
import PDFNode from "./pdf";
import MathNode from "./math";

export default [
    HeadingNode,
    MarkNode,
    QuoteNode,
    LinkNode,
    AutoLinkNode,
    ListNode,
    ListItemNode,
    CanvasNode,
    CodeNode,
    CodeHighlightNode,
    ColumnContainerNode,
    ColumnItemNode,
    DocumentNode,
    ImageNode,
    TableCellNode,
    TableRowNode,
    TableNode,
    VideoNode,
    MathNode,
    // PDFNode,
];