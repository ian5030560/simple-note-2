import { LexicalNode } from "lexical";

export interface FilePluginProps{
    insertFile: (file: File) => string | Promise<string>;
    destroyFile: (node: LexicalNode) => void;
}