import { Extension } from "..";
import CanvasNode from "./node";
import CanvasPlugin from "./plugin";

const CanvasExtension: Extension = {
    plugins: [<CanvasPlugin/>],
    nodes: [CanvasNode]
}

export default CanvasExtension;