import { Editor, Transforms, Element } from "slate";
import { ReactEditor } from "slate-react";

const ImageHelper = {
    /**
     * 
     * @param {Editor} editor 
     * @param {Blob} blob 
     * @param {Element} element
     */
    setSource(editor, blob, element){

        const path = ReactEditor.findPath(editor, element);

        Transforms.setNodes(
            editor,
            {blob: blob},
            {
                at: path
            }
        )
    }
}

export default ImageHelper;