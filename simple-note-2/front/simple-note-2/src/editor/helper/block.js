import { Editor, Element, Transforms } from "slate";

const AlignHelper = {

    isActive(editor, type){

        const {selection} = editor;
        
        if(!selection) return false;

        const match = Array.from(Editor.nodes(
            editor,
            {
                at: Editor.unhangRange(editor, selection),
                match: n => !Editor.isEditor(n) && Element.isElement(n) && n["align"] === type                
            }
        ))

        return match.length === 1;
    },

    toggleBlock(editor, type){
        const isActive = AlignHelper.isActive(editor, type);

        Transforms.setNodes(
            editor,
            {align: isActive? undefined : type},
            {
                at: Editor.unhangRange(editor, editor.selection),
            }
        )
    }
}

export { AlignHelper };