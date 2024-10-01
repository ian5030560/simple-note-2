import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "../../index";
import { useCallback, useEffect, useState } from "react";
import { $getRoot, $isParagraphNode, NodeMutation, ParagraphNode } from "lexical";
import styles from "./index.module.css";
import { createPortal } from "react-dom";
import { theme, Typography } from "antd";
import { useAnchor } from "../richtext";
import { HeadingNode } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";

const PlaceholderPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    // const [open, setOpen] = useState(false);
    // const anchor = useAnchor();
    const { token } = theme.useToken();

    // useEffect(() => editor.registerUpdateListener(() => {
    //     const root = editor.getEditorState().read(() => $getRoot());
    //     const onlyOne = root.getChildrenSize() === 1;
    //     if(onlyOne){
    //         const first = root.getFirstChild();
    //         if($isParagraphNode(first)){
    //             const element = editor.getElementByKey(first.getKey())!;
    //             element.style.removeProperty("--placeholder");
    //         }
    //     }
    // }), [editor]);

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

    // return createPortal(<div className={styles.placeholder} style={{ display: open ? undefined : "none" }}>
    //     <Typography.Text type="secondary">由此開始編輯內容</Typography.Text>
    // </div>, anchor || document.body);
    return null;
}

export default PlaceholderPlugin;