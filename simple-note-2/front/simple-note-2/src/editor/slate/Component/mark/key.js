import MarkHelper from "./helper";

const MarkKeys = [
    {
        key: "mod+b",
        handler: (e, editor) => MarkHelper.toggleMark(editor, "bold")
    },
    {
        key: "mod+i",
        handler: (e, editor) => MarkHelper.toggleMark(editor, "italic")
    },
    {
        key: "mod+u",
        handler: (e, editor) => MarkHelper.toggleMark(editor, "underline")
    }
]

export default MarkKeys;