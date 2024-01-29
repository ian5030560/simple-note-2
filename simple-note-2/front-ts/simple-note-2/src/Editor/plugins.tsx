import React from "react";
import { TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import AutofocusPlugin from "./Lexical/autofocus";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import ToolBarPlugin from "./ToolBar";
import RichTextPlugin from "./Lexical/richtext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";

const PLUGINS: React.ReactNode[] = [
    <ToolBarPlugin />,
    <RichTextPlugin/>,
    <AutofocusPlugin/>,
    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />,
    <HistoryPlugin />,
    <ListPlugin/>,
    <LinkPlugin/>,
]

export default PLUGINS;  