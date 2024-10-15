import { FaCamera } from "react-icons/fa";
import { PlusItem } from "../plugins/draggablePlugin/component";
import { OPEN_IMAGE_TO_TEXT_MODAL } from "../plugins/imageToTextPlugin";

const ImageToText: PlusItem = {
    value: "imageToText",
    label: "Image To Text",
    icon: <FaCamera size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_IMAGE_TO_TEXT_MODAL, undefined)
}

export default ImageToText;