import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import { Plugin } from "../Interface";
import TableModal from "./modal";
import { useEffect } from "react";
import {mergeRegister} from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, LexicalCommand, createCommand } from "lexical";
import { $createTableNodeWithDimensions } from "@lexical/table";

type InsertTablePayload = {
    rows: number;
    cols: number;
    includeHeaders?: boolean;
}
export const INSERT_TABLE: LexicalCommand<InsertTablePayload> = createCommand();
const TablePlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(INSERT_TABLE, (payload) => {
                const node = $createTableNodeWithDimensions(payload.rows, payload.cols, payload.includeHeaders);
                $insertNodes([node]);
                return true;
            }, 4),
        )
    }, []);

    return <>
        <LexicalTablePlugin/>
        <TableModal/> 
    </>
}

export default TablePlugin;