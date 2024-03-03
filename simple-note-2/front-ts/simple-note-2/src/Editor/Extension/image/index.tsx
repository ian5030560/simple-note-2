import { Extension } from "..";
import ImagePlugin from "./plugin";
import ImageNode from "./node";


const ImageExtension: Extension = {
    plugins: [<ImagePlugin/>],
    nodes: [ImageNode],
    theme: {
        image: "simple-note-2-image",
    },
}

export default ImageExtension;