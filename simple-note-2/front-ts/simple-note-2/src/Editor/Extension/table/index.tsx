import { Extension } from "..";
import TablePlugin from "./plugin";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import "./index.css";
import TableActionPlugin from "./action";

const TableExtension: Extension = {
    plugins: [
        <TablePlugin />,
        <TableActionPlugin/>,
    ],

    nodes: [
        TableCellNode,
        TableRowNode,
        TableNode,
    ],

    theme: {
        table: "simple-note-2-table",
        tableAddColumns: "simple-note-2-table-add-columns",
        tableAddRows: "simple-note-2-table-add-rows",
        tableCell: "simple-note-2-table-cell",
        tableCellActionButton: "simple-note-2-table-cell-action-button",
        tableCellActionButtonContainer: "simple-note-2-table-cell-action-button-container",
        tableCellEditing: "simple-note-2-table-cell-editing",
        tableCellHeader: "simple-note-2-table-cell-header",
        tableCellPrimarySelected: "simple-note-2-table-cell-primary-selected",
        tableCellResizer: "simple-note-2-table-cell-resizer",
        tableCellSelected: "simple-note-2-table-cell-selected",
        tableCellSortedIndicator: "simple-note-2-table-cell-sorted-indicator",
        tableResizeRuler: "simple-note-2-table-resize-ruler",
        tableSelected: "simple-note-2-table-selected",
    }
}
export default TableExtension;
