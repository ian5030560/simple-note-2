import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { MdOutlineAddComment } from "react-icons/md";
import { INSERT_COMMENT } from "../../../Extension/comment/plugin";

const Comment = () => {
    const [editor] = useLexicalComposerContext();

    return <Button type="text" icon={<MdOutlineAddComment/>}
    onClick={() => editor.dispatchCommand(INSERT_COMMENT, undefined)}/>
}

export default Comment;