import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "../../index";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import { ParagraphNode } from "lexical";
import { HeadingNode } from "@lexical/rich-text";
import styles from "./index.module.css";
import { Typography } from "antd";

const PLACE_TEXT = "輸入文字...";
const PlaceholderPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {

        let remove = mergeRegister(
            editor.registerMutationListener(HeadingNode, (mutations) => {
                Array.from(mutations.entries()).forEach(mutation => {
                    if(mutation[1] === "created"){
                        let element = editor.getElementByKey(mutation[0]);
                        element?.classList.add(styles.nodePlaceholder);
                        element?.setAttribute("data-placeholder", PLACE_TEXT);
                    }
                })
            }),
            editor.registerMutationListener(ParagraphNode, (mutations) => {
                Array.from(mutations.entries()).forEach(mutation => {
                    if(mutation[1] === "created"){
                        let element = editor.getElementByKey(mutation[0]);
                        element?.classList.add(styles.nodePlaceholder);
                        element?.setAttribute("data-placeholder", PLACE_TEXT);
                    }
                })
            }),
        )

        return remove;
    }, [editor]);

    return null;
}

export default PlaceholderPlugin;

export const Placeholder = () => {
    return <div className={styles.placeholder}>
        <Typography.Text style={{color: "rgba(136, 136, 136, 0.6)"}}>開始你的筆記</Typography.Text>
    </div>
}