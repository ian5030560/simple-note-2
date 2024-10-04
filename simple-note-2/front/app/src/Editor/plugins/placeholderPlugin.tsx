import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect } from "react";
import { NodeMutation, ParagraphNode } from "lexical";
import { theme } from "antd";
import { HeadingNode } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";

export default function PlaceholderPlugin(){
    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();

    const handleMutation = useCallback((mutations: Map<string, NodeMutation>) => {
        Array.from(mutations).forEach(([key, tag]) => {
            if(tag === "destroyed") return;
            const element = editor.getElementByKey(key);
            element?.style.setProperty("--placeholder-color", token.colorTextPlaceholder);
        });
    }, [editor, token.colorTextPlaceholder]);

    useEffect(() => mergeRegister(
        editor.registerMutationListener(ParagraphNode, (mutations) => handleMutation(mutations)),
        editor.registerMutationListener(HeadingNode, (mutations) => handleMutation(mutations))
    ), [editor, handleMutation, token]);

    return null;
}