import { ChatRightTextFill } from "react-bootstrap-icons";
import { ToolKitButton } from "./ui";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function Comment() {
    const [editor] = useLexicalComposerContext();

    return <ToolKitButton icon={<ChatRightTextFill size={24} />} />
    // onClick={() => editor.dispatchCommand(TOGGLE_COMMENTSIDER, undefined)}/>
}