import CanvasNode from "./canvas";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import ColumnContainerNode from "./column/container";
import ColumnItemNode from "./column/item";
import DocumentNode from "./document";
import ImageNode from "./image/block";
import InlineImageNode from "./image/inline";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import VideoNode from "./video";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MarkNode } from "@lexical/mark";
import BlockMathNode from "./math/block";
import InlineMathNode from "./math/inline";

const nodes = [
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
    InlineImageNode,
    TableCellNode,
    TableRowNode,
    TableNode,
    VideoNode,
    BlockMathNode,
    InlineMathNode,
    // PDFNode,
];

export default nodes;