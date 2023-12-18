import { Transforms } from "slate"

const LinkKey = [
    {
        key: "left",
        handler: (e, editor) => {
            Transforms.move(editor, {unit: "offset", reverse: true})
        }
    },
    {
        key: "right",
        handler: (e, editor) => {
            Transforms.move(editor, { unit: 'offset' })
        }
    }
]

export default LinkKey;