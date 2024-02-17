import { LexicalNode, Klass } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MarkNode } from "@lexical/mark";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ImageNode from "./Lexical/image/node";
// import { TableCellNode, TableRowNode } from "@lexical/table";
// import { TableNode } from "./Lexical/table/nodes/TableNode";

const NODES: Klass<LexicalNode>[] = [
    HeadingNode,
    MarkNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    ListItemNode,
    ListNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
    // TableCellNode,
    // TableNode,
    // TableRowNode
]

export default NODES;