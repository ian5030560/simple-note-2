import { EditorThemeClasses } from 'lexical';
import styles from "./index.module.css";

const theme: EditorThemeClasses = {
    ltr: "simple-note-2-ltr",
    rtl: "simple-note-2-ltr",
    paragraph: styles["simple-note-2-paragraph"],
    text: {
        bold: "simple-note-2-text-bold",
        italic: "simple-note-2-text-italic",
        underline: "simple-note-2-text-underline"
    },
    heading: {
        h1: "simple-note-2-heading-1",
        h2: "simple-note-2-heading-2",
        h3: "simple-note-2-heading-3",
        h4: "simple-note-2-heading-4",
        h5: "simple-note-2-heading-5",
        h6: "simple-note-2-heading-6",
    },
    list: {
        listitem: "simple-note-2-list-item",
        nested: {
            list: "simple-note-2-nested-list",
            listitem: "simple-note-2-nested-list-item",
        },
        ol: "simple-note-2-ordered-list",
        olDepth: [
            "simple-note-2-ordered-nested-list-1",
            "simple-note-2-ordered-nested-list-2",
            "simple-note-2-ordered-nested-list-3",
            "simple-note-2-ordered-nested-list-4",
            "simple-note-2-ordered-nested-list-5",
        ],
        ul: "simple-note-2-unordered-list",
    },

    embedBlock: {
        base: "simple-note-2-embed-block",
        focus: "simple-note-2-embed-block-focus",
    },

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
    
};

export default theme;