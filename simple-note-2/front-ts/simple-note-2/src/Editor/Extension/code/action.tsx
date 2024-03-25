import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Plugin } from "..";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { CodeNode } from "@lexical/code";
import { createPortal } from "react-dom";
import { Button, Flex, Select } from "antd";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineContentCopy } from "react-icons/md";
import styles from "./action.module.css";
import { useWrapper } from "../../Draggable/component";
import { CODE_LANGUAGE_FRIENDLY_NAME_MAP } from "@lexical/code";

type LanguagePair = string[];
interface ActionToolProp {
    top: number;
    left: number;
    anchor: Element | DocumentFragment;
    language: string;
    languages: LanguagePair[];
    onCopy: () => void;
    onSelect: (value: string) => void;
    copied: boolean;
}
const Actions = forwardRef((prop: ActionToolProp, ref: React.ForwardedRef<HTMLElement>) => {

    return createPortal(<Flex className={styles.actionContainer} ref={ref}
        style={{ transform: `translate(${prop.left}px, ${prop.top}px)` }}
        contentEditable={false}>
        <Select onSelect={prop.onSelect} style={{minWidth: 100}} 
            size="small" value={prop.language}
            options={prop.languages.map(language => ({
                value: language[0],
                label: language[1]
            }))} />
        <Button type="primary" ghost style={{ marginLeft: 5 }} size="small"
            onClick={prop.onCopy} icon={!prop.copied ? <MdOutlineContentCopy /> : <GiConfirmed />} />
    </Flex>, prop.anchor);
})

function getAllLanguages() {
    const options = [];
    
    for(const [key, value] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)){
        options.push([key, value]);
    }
    return options;
}

const LANGUAGES = getAllLanguages();
const DEFAULT = { top: -10000, left: -10000 };
const CodeActionPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const wrapper = useWrapper();
    const keyRef = useRef<string | null>(null);
    const ref = useRef<HTMLElement>(null);
    const [pos, setPos] = useState(DEFAULT);
    const [copied, setCopied] = useState(false);
    const [lang, setLang] = useState(LANGUAGES[0][0]);

    const handleMouseEnter = useCallback(() => {
        let key = keyRef.current;
        if (!key) return;

        let { x, y, width } = editor.getElementByKey(key)!.getBoundingClientRect();
        let { top, left } = wrapper!.getBoundingClientRect();
        let { width: offset } = ref.current!.getBoundingClientRect();
        
        setPos({ left: x - left + width - offset, top: y - top });

        editor.update(() => {
            let node = $getNodeByKey(key!) as CodeNode;
            let lang = node.getLanguage();
            if(lang) setLang(lang);
        });

    }, [editor, wrapper]);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        if (!keyRef.current) return;

        let { clientX, clientY } = e;
        let { x, y, width, height } = editor.getElementByKey(keyRef.current)!.getBoundingClientRect();
        if (clientX >= x && clientX <= x + width && clientY >= y && clientY <= y + height) return;
        setPos(DEFAULT);
        setCopied(false);
    }, [editor]);

    useEffect(() => {
        return editor.registerMutationListener(CodeNode, (mutations) => {
            editor.update(() => {
                Array.from(mutations.entries()).forEach(([key, type]) => {
                    if (type === "updated") return;

                    let element = editor.getElementByKey(key);
                    if (type === "created") {
                        keyRef.current = key;
                        element?.addEventListener("mouseenter", handleMouseEnter);
                        element?.addEventListener("mouseleave", handleMouseLeave);
                    }
                    else {
                        keyRef.current = null;
                        element?.removeEventListener("mouseenter", handleMouseEnter);
                        element?.removeEventListener("mouseleave", handleMouseLeave);
                        setPos(DEFAULT);
                    }
                })
            })
        })
    }, [editor, handleMouseEnter, handleMouseLeave]);

    const handleCopy = useCallback(() => {
        editor.update(() => {
            setCopied(true);
            let node = $getNodeByKey(keyRef.current!) as CodeNode;
            let content = node.getTextContent();
            if(content.length > 0) navigator.clipboard.writeText(node.getTextContent());
        })

    }, [editor]);

    const handleSelect = useCallback((value: string) => {
        editor.update(() => {
            let node = $getNodeByKey(keyRef.current!) as CodeNode;
            node.setLanguage(value);
        })
    }, [editor]);

    return wrapper ? <Actions top={pos.top} left={pos.left} anchor={wrapper} ref={ref}
        language={lang} copied={copied} languages={LANGUAGES} 
        onCopy={handleCopy} onSelect={handleSelect}/> : null;
}

export default CodeActionPlugin;