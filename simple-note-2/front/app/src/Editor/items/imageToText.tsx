import { FaCamera } from "react-icons/fa";
import { $getNodeByKey, $isBlockElementNode} from "lexical";
import { $isBlockSelected } from "./utils";
import { PlusItem } from "../plugins/draggablePlugin/component";
import { OPEN_IMAGE_TO_TEXT_MODAL } from "../plugins/imageToTextPlugin";

const ImageToText: PlusItem = {
    value: "imageToText",
    label: "Image To Text",
    icon: <FaCamera size={24}/>,
    onSelect: (editor, nodeKey) => {
        const node = $getNodeByKey(nodeKey);
        if(!$isBlockElementNode(node) || !$isBlockSelected(node)) node?.selectEnd();
        editor.dispatchCommand(OPEN_IMAGE_TO_TEXT_MODAL, undefined);
    }
}

export default ImageToText;