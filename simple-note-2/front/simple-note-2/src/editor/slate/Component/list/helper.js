import { Node, Transforms } from "slate";
import { Editor, Element } from "slate";
import NoteEditor from "../../NoteEditor";

class IntVariable {
    
    /**
     * 
     * @param {Number} value 
     */
    constructor(value){
        this.value = value;
    }

    set(value){
        this.value = value;
    }

    get(){
        return this.value;
    }
}

const ListHelper = {

    name: "type",

    isActive(editor, type) {
        const { selection } = editor;

        if (!selection) return false;

        const [match] = Array.from(Editor.nodes(
            editor,
            {
                at: Editor.unhangRange(editor, selection),
                match: n => !Editor.isEditor(n) && Element.isElement(n) && n[this.name] === type
            }
        ))
        
        return !!match;
    },

    /**
     * 
     * @param {Editor} editor 
     * @param {string} type 
     */
    toggleBlock(editor, type) {
        const isActive = this.isActive(editor, type);
        const prev = NoteEditor.previousElement(editor, editor.selection);
        this.sorted(isActive, prev.index, editor, type);
    },

    /**
     * 
     * @param {boolean} active 
     * @param {number} start 
     * @param {Editor} editor 
     * @param {string} type 
     */
    sorted(active, start, editor, type){
        const nodes = NoteEditor.nodes(editor, {match: n => Element.isElement(n)});
        var i = new IntVariable(start ? start : 0);

        for(let node of nodes) {
            Transforms.setNodes(
                editor,
                {type: !active ? type : "paragraph",
                 index: !active && type === "ordered" ? (() => {
                    i.set(i.get() + 1);
                    return i.get();
                 })() : undefined},
                {
                    at: editor.selection,
                    match: n => {
                        if(Element.isElement(n) && Node.matches(n, node[0])){
                            if(node[0].children.length === 1 && !node[0].children[0].text){
                                i.set(0);
                                return false;
                            }
                        }
                        return Element.isElement(n) && Node.matches(n, node[0]);
                    }
                }
            )
        }
    }
}

export default ListHelper;