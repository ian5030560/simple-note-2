import { useCallback, useState } from "react";
import { Plugin } from "..";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { CodeNode } from "@lexical/code";
import { Button, Select } from "antd";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineContentCopy } from "react-icons/md";
import { CODE_LANGUAGE_FRIENDLY_NAME_MAP } from "@lexical/code";
import Corner from "../UI/corner";

function getAllLanguages() {
    const options = [];

    for (const [key, value] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
        options.push([key, value]);
    }
    return options;
}

const LANGUAGES = getAllLanguages();
const CodeActionPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();
    const [key, setKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [lang, setLang] = useState(LANGUAGES[0][0]);

    const handleEnter = useCallback((key: string) => {

        editor.update(() => {
            let node = $getNodeByKey(key!) as CodeNode;
            let lang = node.getLanguage();
            if (lang) setLang(lang);
            setKey(key);
        });

    }, [editor]);

    const handleLeave = useCallback(() => {
        setCopied(false);
        setKey(null);
    }, []);

    const handleCopy = useCallback(() => {
        editor.update(() => {
            setCopied(true);
            let node = $getNodeByKey(key!) as CodeNode;
            let content = node.getTextContent();
            if (content.length > 0) navigator.clipboard.writeText(node.getTextContent());
        })

    }, [editor, key]);

    const handleSelect = useCallback((value: string) => {
        editor.update(() => {
            let node = $getNodeByKey(key!) as CodeNode;
            node.setLanguage(value);
        })
    }, [editor, key]);

    return <Corner nodeType={CodeNode} placement={["top", "right"]} trigger="hover"
        onEnterNode={handleEnter} onLeaveNode={handleLeave}>
        <Select onSelect={handleSelect} style={{ minWidth: 100 }}
            size="small" value={lang}
            options={LANGUAGES.map(language => ({
                value: language[0],
                label: language[1]
            }))} />
        <Button type="primary" ghost style={{ marginLeft: 5 }} size="small"
            onClick={handleCopy} icon={!copied ? <MdOutlineContentCopy /> : <GiConfirmed />} />
    </Corner>

}

export default CodeActionPlugin;