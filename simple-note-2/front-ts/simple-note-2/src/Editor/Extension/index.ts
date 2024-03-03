import { EditorThemeClasses, Klass, LexicalNode } from "lexical"
import React from "react";
import BasicExtension from "./basic";
import SpeechToTextExtension from "./speechToText";
import ImageExtension from "./image";
import CanvasExtension from "./canvas";

export type Plugin<T = {}> = React.FC<T>

export interface CSSModule{
    [key: string]: string;
}

export interface Extension {
    plugins: Exclude<React.ReactNode, undefined>[],
    nodes?: Klass<LexicalNode>[],
    theme?: EditorThemeClasses,
    styleSheet?: CSSModule
}

const Extensions: Extension[] = [
    BasicExtension,
    SpeechToTextExtension,
    ImageExtension,
    CanvasExtension,
    
]

export default Extensions;