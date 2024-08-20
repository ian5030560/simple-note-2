import { Plugin } from "../../index";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import { DragWrapper } from "../../../Draggable/component";
import styles from "./index.module.css";
import Scroller from "./scroll";
import { Placeholder } from "../placeholder";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <Scroller>
        <DragWrapper>
            <LexicalRichTextPlugin
                contentEditable={<ContentEditable className={styles.editable} style={{ color: token.colorText }} />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary} />
        </DragWrapper>
    </Scroller>
}

export default RichTextPlugin;