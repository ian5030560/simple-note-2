import { PlusItem } from "../Draggable/component";
import { MdOndemandVideo } from "react-icons/md";
import { OPEN_VIDEO_MODAL } from "../Extension/video/plugin";

const Video: PlusItem = {
    value: "video",
    label: "Video",
    icon: <MdOndemandVideo size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_VIDEO_MODAL, undefined), 
}

export default Video;