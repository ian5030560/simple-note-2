import { PlusItem } from "../Draggable/component";
import { AiOutlinePicture } from "react-icons/ai";
import { OPEN_IMAGE_MODAL } from "../Extension/image/modal";
import { $getNodeByKey } from "lexical";

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