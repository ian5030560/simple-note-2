import { Plugin } from "../../index";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import { DragWrapper, useWrapper } from "../../../Draggable/component";
import styles from "./index.module.css";
import Scroller from "./scroll";
import { Placeholder } from "../placeholder";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();
    const wrapper = useWrapper();

    return <LexicalRichTextPlugin
        contentEditable={
            <Scroller>
                <DragWrapper>
                    <ContentEditable className={styles.editable} style={{ color: token.colorText }} />
                </DragWrapper>
            </Scroller>
        }
        placeholder={<Placeholder anchor={wrapper}/>}
        ErrorBoundary={LexicalErrorBoundary}
    />
}

export default RichTextPlugin;