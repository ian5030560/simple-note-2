import { Plugin } from "../../index";
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import styles from "./index.module.css";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <div id="editor-scroller" className={styles.editorScroller}>
        <div id="dnd-anchor" className={styles.anchor}>
            <LexicalRichTextPlugin
                contentEditable={<ContentEditable className={styles.editable} style={{ color: token.colorText }} />}
                placeholder={<></>}
                ErrorBoundary={LexicalErrorBoundary} />
        </div>
    </div>
}

export default RichTextPlugin;