import { Editor } from "slate";
import { FONTFAMILY, FONTSIZE } from ".";

const FamilyHelper = {
    
    detectFamily(editor){
        const marks = Editor.marks(editor);
        return marks ? marks[FONTFAMILY] ? marks[FONTFAMILY] : "default" : "default";
    },

    changeFamily(editor, font){
        if(font === "default"){
            Editor.removeMark(editor, FONTFAMILY);
        }
        else{
            Editor.addMark(editor, FONTFAMILY, font)
        };
    }
}

const SizeHelper = {

    detectSize(editor){
        const marks = Editor.marks(editor);
        return marks ? marks[FONTSIZE] ? marks[FONTSIZE] : "initial" : "initial";
    },

    changeSize(editor, size){
        Editor.addMark(editor, FONTSIZE, size);
    }
}

export{ 
    FamilyHelper,
    SizeHelper
};