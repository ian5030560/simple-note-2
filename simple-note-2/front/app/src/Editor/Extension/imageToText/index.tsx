import { Extension, Plugin } from "..";
import ImageToTextModal from "./modal";

const ImageToTextPlugin: Plugin = () => <ImageToTextModal/>;

const ImageToTextExtension: Extension = {
    plugins: [<ImageToTextPlugin/>],
}

export default ImageToTextExtension;