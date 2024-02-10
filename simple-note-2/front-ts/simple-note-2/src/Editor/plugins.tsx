import React from "react";
import { TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import AutofocusPlugin from "./Lexical/autofocus";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import RichTextPlugin from "./Lexical/richtext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import DraggablePlugin from "./Lexical/draggable";
import ADDLIST from "./addList";

const PLUGINS: React.ReactNode[] = [
    <RichTextPlugin />,
    <AutofocusPlugin />,
    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />,
    <HistoryPlugin />,
    <ListPlugin />,
    <LinkPlugin />,
    <DraggablePlugin addList={ADDLIST}/>,
]

export default PLUGINS;  