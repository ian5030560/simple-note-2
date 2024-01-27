import { Transforms } from "slate"
import createHotKey from "../../spec/hotkey"

export const LinkLeft = createHotKey(
    "left",
    (_, editor) => Transforms.move(editor, {unit: "offset", reverse: true})
)

export const LinkRight = createHotKey(
    "right",
    (_, editor) => Transforms.move(editor, { unit: 'offset' })
)