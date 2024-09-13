import { Extension } from "..";
import VideoNode from "./node";
import VideoPlugin from "./plugin";

const VideoExtension: Extension = {
    plugins: [<VideoPlugin/>],
    nodes: [VideoNode],
}

export default VideoExtension;