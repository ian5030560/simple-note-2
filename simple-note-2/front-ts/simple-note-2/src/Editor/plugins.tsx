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
import ImagePlugin from "./Lexical/image";
import SavePlugin from "./Lexical/save";
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import ListMaxLevelPlugin from "./Lexical/listmaxlevel";
import SpeechToTextPlugin from "./Lexical/speechToText";
import KeywordSearchPlugin from "./Lexical/keywordSearch";
import CanvasPlugin from "./Lexical/canvas";
// import TablePlugin from "./Lexical/table";

const PLUGINS: React.ReactNode[] = [
    <RichTextPlugin />,
    <AutoFocusPlugin />,
    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />,
    <HistoryPlugin />,
    <ListPlugin />,
    <LinkPlugin />,
    <DraggablePlugin addList={ADDLIST} />,
    <FloatingLinkPlugin />,
    <ImagePlugin />,
    <SavePlugin />,
    <TabIndentationPlugin />,
    <ListMaxLevelPlugin maxLevel={5}/>,
    // <TablePlugin/>,
    // <KeywordSearchPlugin/>,
    <SpeechToTextPlugin/>,
    <CanvasPlugin/>,
]

export default PLUGINS;  