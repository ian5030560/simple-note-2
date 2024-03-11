import { Extension } from "..";
import ImagePlugin from "./plugin";
import ImageNode from "./node";
import styles from "./index.module.css";

const ImageExtension: Extension = {
    plugins: [<ImagePlugin/>],
    nodes: [ImageNode],
    styleSheet: styles,
    theme: {
        image: "simple-note-2-image",
    },
}

export default ImageExtension;