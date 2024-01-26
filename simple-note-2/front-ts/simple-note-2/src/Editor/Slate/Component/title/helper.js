import { Transforms, Editor, Element } from "slate";
import {H1, H2, H3, H4, H5, H6} from ".";

const TitleHelper = {

    TITLE: Object.keys({H1, H2, H3, H4, H5, H6}),

    isActive(editor, type){
        const { selection } = editor;

        if (!selection) return false;

        const [match] = Array.from(Editor.nodes(
            editor,
            {
                at: Editor.unhangRange(editor, selection),
                match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === type
            }
        ))

        return !!match;
    },

    toggleTitle(editor, type){
        const isActive = this.isActive(editor, type);

        Transforms.setNodes(
            editor,
            {type: isActive ? "paragraph" : type}
        )
    }
}

export default TitleHelper