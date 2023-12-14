import { Editor } from "slate";

const FamilyHelper = {
    
    detectFamily(editor){
        const marks = Editor.marks(editor);
        return marks ? marks.family ? marks.family : "initial" : "initial";
    },

    changeFamily(editor, font){
        Editor.addMark(editor, "family", font);
    }
}

const SizeHelper = {

    detectSize(editor){
        const marks = Editor.marks(editor);
        return marks ? marks.size ? marks.size : "initial" : "initial";
    },

    changeSize(editor, size){
        Editor.addMark(editor, "size", size);
    }
}

export{ 
    FamilyHelper,
    SizeHelper
};