import React from "react";
import { TRANSFORMERS } from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import RichTextPlugin from "./Lexical/richtext";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import DraggablePlugin from "./Lexical/draggable";
import ADDLIST from "./addList";
import LinkPlugin, { FloatingLinkPlugin } from "./Lexical/link";

const PLUGINS: React.ReactNode[] = [
    <RichTextPlugin />,
    <AutoFocusPlugin />,
    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />,
    <HistoryPlugin />,
    <ListPlugin />,
    <LinkPlugin />,
    <DraggablePlugin addList={ADDLIST} />,
    <FloatingLinkPlugin/>,
    
]

export default PLUGINS;  