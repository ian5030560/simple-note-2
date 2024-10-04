import { AiOutlinePicture } from "react-icons/ai";
import { $getNodeByKey } from "lexical";
import { PlusItem } from "../plugins/draggablePlugin/component";
import { OPEN_IMAGE_MODAL } from "../plugins/imagePlugin/modal";

const Image: PlusItem = {
    value: "image",
    label: "Image",
    icon: <AiOutlinePicture size={24}/>,
    onSelect: (editor, nodeKey) => {
        $getNodeByKey(nodeKey)?.selectEnd();
        editor.dispatchCommand(OPEN_IMAGE_MODAL, true);
    },
}

export default Image;