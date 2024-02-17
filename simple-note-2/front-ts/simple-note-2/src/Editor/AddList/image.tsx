import { Modal as AntModal } from "antd";
import { AddItem } from "../Lexical/draggable/component";
import { AiOutlinePicture } from "react-icons/ai";
import { OPEN_IMAGE_MODAL } from "../Lexical/image/modal";

const Image: AddItem = {
    value: "image",
    label: "Image",
    icon: <AiOutlinePicture size={24}/>,
    onSelect: (editor) => {
        editor.dispatchCommand(OPEN_IMAGE_MODAL, true);
    },
}

export default Image;