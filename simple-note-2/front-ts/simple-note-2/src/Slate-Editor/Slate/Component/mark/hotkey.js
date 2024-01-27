import createHotKey from "../../spec/hotkey";
import MarkHelper from "./helper";

export const MarkModB = createHotKey(
    "mod+b",
    (_, editor) => MarkHelper.toggleMark(editor, "bold")
)

export const MarkModI = createHotKey(
    "mod+i",
    (_, editor) => MarkHelper.toggleMark(editor, "italic")
)

export const MarkModU = createHotKey(
    "mod+u",
    (_, editor) => MarkHelper.toggleMark(editor, "underline")
)