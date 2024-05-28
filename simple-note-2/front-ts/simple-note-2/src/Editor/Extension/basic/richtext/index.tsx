import { Plugin } from "../../index";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import { DragWrapper } from "../../../Draggable/component";
import styles from "./index.module.css";
import Scroller from "./scroll";
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ParagraphNode } from "lexical";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.registerMutationListener(ParagraphNode, (mutations) => {
            const entities = Array.from(mutations.entries());
            for(let entity of entities) {
                if(entity[1] !== "destroyed"){
                    let element = editor.getElementByKey(entity[0]);
                    element!.style.borderBottom = `1px solid ${token.colorText}`;
                }
            }
        })

    }, [editor, token.colorText]);

    return <LexicalRichTextPlugin
        contentEditable={
            <Scroller>
                <DragWrapper>
                    <ContentEditable className={styles.editable} style={{ color: token.colorText }} />
                </DragWrapper>
            </Scroller>
        }
        placeholder={<></>}
        ErrorBoundary={LexicalErrorBoundary}
    />
}

export default RichTextPlugin;