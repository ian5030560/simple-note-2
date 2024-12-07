import { createCommand, LexicalNode } from "lexical";

export const PLUSMENU_SELECTED = createCommand<{node: LexicalNode, keyPath: string[]}>();