import { Extension } from "..";
import CommentPlugin from "./plugin";

const CommentExtension: Extension = {
    plugins: [<CommentPlugin />],
}

export default CommentExtension;