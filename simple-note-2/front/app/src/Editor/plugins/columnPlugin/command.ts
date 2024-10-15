import { LexicalCommand, createCommand } from "lexical";

// export const INSERT_COLUMNS: LexicalCommand<number> = createCommand();
export const OPEN_COLUMN_MODAL: LexicalCommand<void> = createCommand();
export const APPEND_COLUMNS: LexicalCommand<number> = createCommand();