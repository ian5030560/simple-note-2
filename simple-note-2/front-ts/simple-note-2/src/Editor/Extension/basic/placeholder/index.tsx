import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "../../index";
import { useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { ParagraphNode } from "lexical";
import { HeadingNode } from "@lexical/rich-text";
import styles from "./index.module.css";

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

export const Placeholder = ({anchor}: {anchor: HTMLElement | null}) => {
    const [pos, setPos] = useState({x: 0, y: 0});

    useEffect(() => {
        if(!anchor) return;

        let resizer = new ResizeObserver(() => {
            let rect = anchor.getBoundingClientRect();
            setPos({x: rect.x, y: rect.y});
        });

        resizer.observe(document.body);

        return () => {
            resizer.unobserve(document.body);
            resizer.disconnect();
        }
    })

    return <div style={{top: pos.y, left: pos.x}} className={styles.placeholder}>
        <span>開始你的筆記</span>
    </div>
}