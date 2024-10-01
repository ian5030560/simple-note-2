import { Plugin } from "../../index";
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin as LexicalRichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { theme } from "antd";
import { useState, useEffect } from "react";

export const useAnchor = () => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    useEffect(() => {
        setAnchor(document.getElementById("editor-anchor"));
    }, []);

    return anchor;
}

const RichTextPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <LexicalRichTextPlugin
        contentEditable={<ContentEditable style={{color: token.colorText, outline: "none", cursor: "text"}} />}
        placeholder={<></>}
        ErrorBoundary={LexicalErrorBoundary} />
}

export default RichTextPlugin;