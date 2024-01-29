import { Plugin } from "../Interface";
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <LexicalRichTextPlugin
        contentEditable={<ContentEditable className="editable" style={{ color: token.colorText }} />}
        placeholder={<></>}
        ErrorBoundary={LexicalErrorBoundary}
    />
}

export default RichTextPlugin;