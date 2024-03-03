import { Plugin } from "..";
import {TablePlugin as LexicalTablePlugin} from '@lexical/react/LexicalTablePlugin';
import TableModal from "./modal";

const TablePlugin: Plugin = () => {
    return <>
        <LexicalTablePlugin/>
        <TableModal/>
    </>
}

export default TablePlugin;