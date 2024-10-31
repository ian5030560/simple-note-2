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

export default function RichTextPlugin() {
    const { token } = theme.useToken();
    const [editor] = useLexicalComposerContext();

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
        editor.update(() => {
            let newNode: LexicalNode | undefined = undefined;
            const heading = ["h1", "h2", "h3", "h4", "h5", "h6"];
            if (value === "paragraph") {
                newNode = $createParagraphNode();
            }
            else if (value === "code") {
                newNode = $createCodeNode()
            }
            else if (heading.includes(value)) {
                newNode = $createHeadingNode(value as HeadingTagType);
            }

            if (newNode) {
                node.insertAfter(newNode);
                newNode.selectStart();
            }
        });
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    return <LexicalRichTextPlugin placeholder={<></>} ErrorBoundary={LexicalErrorBoundary}
        contentEditable={<ContentEditable style={{ color: token.colorText, outline: "none", cursor: "text" }} />} />
}