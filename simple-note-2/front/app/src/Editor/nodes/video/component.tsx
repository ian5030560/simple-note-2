import { VideoNodeProp } from "."
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";

type VideoProp = VideoNodeProp;
const Video = (prop: VideoProp) => {
    return <BlockWithAlignableContents className={prop.className} format={prop.format} nodeKey={prop.nodeKey}>
        <video src={prop.src} width={prop.width} height={prop.height} playsInline controls preload="metadata" />
    </BlockWithAlignableContents>
}
export default Video;