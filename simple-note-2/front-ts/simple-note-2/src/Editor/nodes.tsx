import { LexicalNode, Klass } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MarkNode } from "@lexical/mark";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import ImageNode from "./Lexical/image/node";
// import KeywordNode from "./Lexical/keywordSearch/node";
import { TableCellNode, TableRowNode, TableNode } from "@lexical/table";

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
    // KeywordNode,
    TableCellNode,
    TableNode,
    TableRowNode,

]

export default NODES;