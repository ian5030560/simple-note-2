import { MenuOutlined } from "@ant-design/icons";
import { ToolKitButton } from "./ui";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TABLE_OF_CONTENT } from "../Extension/tablofContent";

export default function TableOfContent() {
    const [editor] = useLexicalComposerContext();

    return <ToolKitButton icon={<MenuOutlined />}
        onClick={() => editor.dispatchCommand(TABLE_OF_CONTENT, undefined)} />
}