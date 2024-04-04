import { EditorThemeClasses, Klass, LexicalNode } from "lexical"
import React from "react";
import BasicExtension from "./basic";
import SpeechToTextExtension from "./speechToText";
import ImageExtension from "./image";
import CanvasExtension from "./canvas";
import TableExtension from "./table";
import AIExtension from "./ai";
import CodeExtension from "./code";
import ImageToTextExtension from "./imageToText";
import VideoExtension from "./video";
import DocumentExtension from "./document";
import ColumnLayoutExtension from "./columns";
import { LexicalNodeReplacement } from "lexical";
import CommentExtension from "./comment";

export type Plugin<T = {}> = React.FC<T>

export interface CSSModule{
    [key: string]: string;
}

export interface Extension {
    plugins: Exclude<React.ReactNode, undefined>[],
    nodes?: (Klass<LexicalNode> | LexicalNodeReplacement)[],
    theme?: EditorThemeClasses,
    styleSheet?: CSSModule
}

const Extensions: Extension[] = [
    BasicExtension,
    SpeechToTextExtension,
    ImageExtension,
    CanvasExtension,
    TableExtension,
    CodeExtension,
    ImageToTextExtension,
    VideoExtension,
    DocumentExtension,
    AIExtension,
    ColumnLayoutExtension,
    CommentExtension,
]

export default Extensions;