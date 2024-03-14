import { Extension } from "..";
import VideoNode from "./node";
import VideoPlugin from "./plugin";
import styles from "./index.module.css";

const VideoExtension: Extension = {
    plugins: [<VideoPlugin/>],
    nodes: [VideoNode],
    theme: {
        embedBlock: {
            base: "simple-note-2-embedBlock",
            focus: "simple-note-2-embedBlock-focus",
        }
    },
    styleSheet: styles,
}

export default VideoExtension;