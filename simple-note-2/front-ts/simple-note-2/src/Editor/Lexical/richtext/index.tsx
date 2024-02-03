import { Plugin } from "../Interface";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import { DragWrapper } from "../draggable/component";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <LexicalRichTextPlugin
        contentEditable={
            <DragWrapper>
                <ContentEditable className="editable" id="editable" style={{ color: token.colorText }} />
            </DragWrapper>
        }
        placeholder={<></>}
        ErrorBoundary={LexicalErrorBoundary}
    />
}

export default RichTextPlugin;