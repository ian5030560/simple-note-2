import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { theme } from "antd";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import { COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $createParagraphNode } from "lexical";
import { $createCodeNode } from "@lexical/code";

interface RichTextPluginProps {
    rootClassName: string;
}
export default function RichTextPlugin(props: RichTextPluginProps) {
    const { token } = theme.useToken();
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({ node, keyPath }) => {
        let newNode: LexicalNode | undefined = undefined;
        if (keyPath[0] === "paragraph") {
            newNode = $createParagraphNode();
        }
        else if (keyPath[0] === "code") {
            newNode = $createCodeNode()
        }
        else if (keyPath[0] === "heading") {
            newNode = $createHeadingNode(keyPath[1] as HeadingTagType);
        }

        if (newNode) {
            node.insertAfter(newNode);
            newNode.selectStart();
        }
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    return <LexicalRichTextPlugin placeholder={<></>} ErrorBoundary={LexicalErrorBoundary}
        contentEditable={<ContentEditable className={props.rootClassName} style={{ color: token.colorText }} />} />
}