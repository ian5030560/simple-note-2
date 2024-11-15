import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, NodeKey } from "lexical";
import { CodeNode } from "@lexical/code";
import { Button, Flex, message, Select } from "antd";
import { CODE_LANGUAGE_FRIENDLY_NAME_MAP } from "@lexical/code";
import Action from "../../ui/action";
import { inside } from "../../utils";
import { Clipboard } from "react-bootstrap-icons";

const LANGUAGES = CODE_LANGUAGE_FRIENDLY_NAME_MAP;

export default function CodeActionPlugin(){
    const [editor] = useLexicalComposerContext();
    const [lang, setLang] = useState<string>("");
    const [key, setKey] = useState<NodeKey>();
    const [api, contextholder] = message.useMessage();

    const handleEnter = useCallback((key: string) => {
        editor.update(() => {
            const node = $getNodeByKey(key) as CodeNode;
            const lang = node.getLanguage();
            if (lang) setLang(lang);
            setKey(key);
        });
    }, [editor]);

    const handleLeave = useCallback((e: MouseEvent, key: string) => {

        const { clientX: x, clientY: y } = e;
        const element = editor.getElementByKey(key);

        if (element && inside(x, y, element)) return;
        setKey(undefined);
    }, [editor]);

    useEffect(() => editor.registerMutationListener(CodeNode, mutations => {
        Array.from(mutations).forEach(([nodeKey, tag]) => {
            if (tag === "updated") return;

            if (tag === "created") {
                const element = editor.getElementByKey(nodeKey);
                element?.addEventListener("pointerenter", () => handleEnter(nodeKey));
                element?.addEventListener("pointerleave", (e) => handleLeave(e, nodeKey));
            }
            else {
                if (key === nodeKey) {
                    setKey(undefined);
                }
            }
        });
    }), [editor, handleEnter, handleLeave, key]);

    const handleCopy = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(key!) as CodeNode;
            const content = node.getTextContent();
            if (content.length > 0) navigator.clipboard.writeText(node.getTextContent());
            api.success("複製成功");
        })

    }, [api, editor, key]);

    const handleSelect = useCallback((value: string) => {
        if (!key) return;
        editor.update(() => {
            const node = $getNodeByKey(key!) as CodeNode;
            node.setLanguage(value);
        })
    }, [editor, key]);

    const handleContainerLeave = useCallback((e: React.MouseEvent) => {
        if (!key) return;

        const { clientX: x, clientY: y } = e;
        const element = editor.getElementByKey(key);

        if (!element && inside(x, y, element!)) return;

        setKey(undefined);
    }, [editor, key]);

    return key ? <Action nodeKey={key} placement={["top", "right"]} open={true}>
        <Flex onPointerLeave={handleContainerLeave}>
            <Select size="small" value={lang} onSelect={handleSelect} style={{ minWidth: 100 }}
                options={Object.keys(LANGUAGES).map(key => ({ value: key, label: LANGUAGES[key] }))} />
            <Button type="primary" ghost style={{ marginLeft: 5 }} size="small"
                onClick={handleCopy} icon={<Clipboard />} />
            {contextholder}
        </Flex>
    </Action> : null;
}