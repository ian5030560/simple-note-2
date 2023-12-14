import { Editor, Transforms, Element } from "slate";
import { ReactEditor } from "slate-react";

const ImageHelper = {
    /**
     * 
     * @param {Editor} editor 
     * @param {string} src 
     * @param {Element} element
     */
    setSource(editor, src, element){

        const path = ReactEditor.findPath(editor, element);

        Transforms.setNodes(
            editor,
            {src: src},
            {
                at: path
            }
        )
    }
}

export default ImageHelper;