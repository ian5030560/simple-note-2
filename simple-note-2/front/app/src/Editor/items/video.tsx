import { MdOndemandVideo } from "react-icons/md";
import { PlusItem } from "../plugins/draggablePlugin/component";
import { OPEN_VIDEO_MODAL } from "../plugins/videoPlugin";

const Video: PlusItem = {
    value: "video",
    label: "Video",
    icon: <MdOndemandVideo size={24}/>,
    onSelect: (editor) => editor.dispatchCommand(OPEN_VIDEO_MODAL, undefined), 
}

export default Video;