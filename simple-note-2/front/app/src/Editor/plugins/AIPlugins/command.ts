import { createCommand, LexicalCommand } from "lexical";

export const SET_AIPLACEHOLDER: LexicalCommand<boolean> = createCommand();
export const SEND_SERVER_AT_AIPLACEHOLDER: LexicalCommand<string> = createCommand();