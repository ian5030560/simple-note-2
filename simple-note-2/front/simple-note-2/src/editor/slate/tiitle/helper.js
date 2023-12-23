import { Transforms, Editor, Element } from "slate";
import Title from ".";


/**
 * 
 * @param {Editor} editor 
 */
function detectSelectionType(editor) {
    const [match] = Array.from(Editor.nodes(
        editor,
        {
            match: n => Element.isElement(n)
        }
    ))

    return match;
}

const TitleHelper = {

    TITLE: Object.keys(Title),

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
        const current = detectSelectionType(editor);

        if(this.TITLE.includes(current[0].type)){
            Transforms.setNodes(
                editor,
                {type: isActive ? "paragraph" : type}
            )
        }
    }
}

export default TitleHelper