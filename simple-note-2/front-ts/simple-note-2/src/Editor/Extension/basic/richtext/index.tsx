import { Plugin } from "../../index";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import { DndAnchor } from "../../../Draggable/component";
import styles from "./index.module.css";
import Scroller from "./scroll";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <Scroller>
        <DndAnchor>
            <LexicalRichTextPlugin
                contentEditable={<ContentEditable className={styles.editable} style={{ color: token.colorText }} />}
                placeholder={<></>}
                ErrorBoundary={LexicalErrorBoundary} />
        </DndAnchor>
    </Scroller>
}

export default RichTextPlugin;