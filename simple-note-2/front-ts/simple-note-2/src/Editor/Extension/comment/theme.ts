import { EditorThemeClasses } from "lexical/LexicalEditor";

const theme: EditorThemeClasses = {
    ltr: "simple-note-2-ltr",
    rtl: "simple-note-2-ltr",
    paragraph: "simple-note-2-paragraph",
    text: {
        bold: "simple-note-2-text-bold",
        italic: "simple-note-2-text-italic",
        underline: "simple-note-2-text-underline",
        code: "simple-note-2-text-code",
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
        checklist: "simple-note-2-checked-list",
        listitemChecked: "simple-note-2-checked-list-checked",
        listitemUnchecked: "simple-note-2-checked-list-unchecked",
    },
}

export default theme;