import { Plugin } from "../Interface";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import { DragWrapper } from "../draggable/component";
import styles from "./index.module.css";

import Scroller from "./scroller";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();

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