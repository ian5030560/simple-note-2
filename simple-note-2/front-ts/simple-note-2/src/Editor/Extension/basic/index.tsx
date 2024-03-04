import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { Extension } from "..";
import RichTextPlugin from "./richtext/index";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from '@lexical/markdown';
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { MarkNode } from "@lexical/mark";
import LinkPlugin, { FloatingLinkPlugin } from "./link";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import ListMaxLevelPlugin from "./listMaxLevel";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import styles from "./index.module.css";


const BasicExtension: Extension = {
    plugins: [
        <RichTextPlugin />,
        <AutoFocusPlugin />,
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />,
        <HistoryPlugin />,
        <TabIndentationPlugin />,
        <LinkPlugin />,
        <ListMaxLevelPlugin maxLevel={5} />,
        <ListPlugin />,
        <FloatingLinkPlugin/>,
    ],

    nodes: [
        HeadingNode,
        MarkNode,
        QuoteNode,
        LinkNode,
        AutoLinkNode,
        ListItemNode,
        ListNode,
        CodeNode,
        CodeHighlightNode,
    ],

    styleSheet: styles,
    
    theme: {
        ltr: "simple-note-2-ltr",
        rtl: "simple-note-2-ltr",
        paragraph: "simple-note-2-paragraph",
        text: {
            bold: "simple-note-2-text-bold",
            italic: "simple-note-2-text-italic",
            underline: "simple-note-2-text-underline"
        },
        heading: {
            h1: "simple-note-2-heading-1",
            h2: "simple-note-2-heading-2",
            h3: "simple-note-2-heading-3",
            h4: "simple-note-2-heading-4",
            h5: "simple-note-2-heading-5",
            h6: "simple-note-2-heading-6",
        },
        list: {
            listitem: "simple-note-2-list-item",
            nested: {
                list: "simple-note-2-nested-list",
                listitem: "simple-note-2-nested-list-item",
            },
            ol: "simple-note-2-ordered-list",
            olDepth: [
                "simple-note-2-ordered-nested-list-1",
                "simple-note-2-ordered-nested-list-2",
                "simple-note-2-ordered-nested-list-3",
                "simple-note-2-ordered-nested-list-4",
                "simple-note-2-ordered-nested-list-5",
            ],
            ul: "simple-note-2-unordered-list",
        },
    }
}

export default BasicExtension;