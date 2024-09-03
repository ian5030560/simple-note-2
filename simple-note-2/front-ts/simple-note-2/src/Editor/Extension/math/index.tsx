import { Extension } from "..";
import MathNode from "./node";
import MathPlugin from "./plugin";
import "./index.css";

const MathExtension: Extension = {
    plugins: [<MathPlugin/>],
    nodes: [MathNode],
    theme: {
        math: "simple-note-2-math",
    }
}

export default MathExtension;