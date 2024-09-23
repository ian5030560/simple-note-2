import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "../../index";
import { useEffect } from "react";
import { mergeRegister } from "@lexical/utils";
import { NodeMutation, ParagraphNode } from "lexical";
import { HeadingNode } from "@lexical/rich-text";
import styles from "./index.module.css";

const PLACE_TEXT = "輸入文字...";
const PlaceholderPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        function handleMutated(mutations: Map<string, NodeMutation>) {
            Array.from(mutations.entries()).forEach(mutation => {
                const element = editor.getElementByKey(mutation[0]);
                if (mutation[1] === "created" || (mutation[1] === "updated" &&
                    !element?.hasAttribute("data-placeholder"))) 
                {
                    element?.classList.add(styles.nodePlaceholder);
                    element?.setAttribute("data-placeholder", PLACE_TEXT);
                }
            })
        }
        const remove = mergeRegister(
            editor.registerMutationListener(HeadingNode, (mutations) => handleMutated(mutations)),
            editor.registerMutationListener(ParagraphNode, (mutations) => handleMutated(mutations)),
        )

        return remove;
    }, [editor]);

    return null;
}

export default PlaceholderPlugin;