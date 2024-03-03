import { AddItem } from "../Draggable/component";
import { AiOutlinePicture } from "react-icons/ai";
import { OPEN_IMAGE_MODAL } from "../Extension/image/modal";

const Image: AddItem = {
    value: "image",
    label: "Image",
    icon: <AiOutlinePicture size={24}/>,
    onSelect: (editor) => {
        editor.dispatchCommand(OPEN_IMAGE_MODAL, true);
    },
}

export default Image;