import { AudioOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ToolKitButton } from "./ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Dropdown, Typography } from "antd";
import { $getRoot, $getSelection, $isRangeSelection } from "lexical";
import { createPortal } from "react-dom";
import { ItemType } from "antd/es/menu/interface";

const langcodes = require("../../../resource/bcp47.json");

function usePreview(duration: number): [(content: string) => void, React.ReactNode | null] {
    const [content, setContent] = useState<string>();
    const timer = useRef<NodeJS.Timeout>();

    const clean = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = undefined;
        }
    }, []);

    useEffect(() => {
        if (content) {
            clean();
            timer.current = setTimeout(() => {
                setContent(undefined);
            }, duration);
        }
        return clean;
    }, [clean, content, duration]);

    const text = useCallback((content: string) => setContent(content), []);

    const context = useMemo(() => timer.current && content ? createPortal(<div
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <Typography.Title level={3}>{content}</Typography.Title>
    </div>, document.body) : null, [content]);

    return [text, context];
}

// @ts-expect-error missing type
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SUPPORT_SPEECHRECOGNITION = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
// const SUPPORT_SPEECHRECOGNITION = false;
const State = {
    BEGIN: "開始錄音",
    END: "錄音結束"
}

const alertStyle: React.CSSProperties = { position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)" };

export default function SpeechToText() {
    const [editor] = useLexicalComposerContext();
    // @ts-expect-error missing type
    const recognition = useRef<SpeechRecognition | null>(null);
    const [active, setActive] = useState(false);
    const [preview, context] = usePreview(500);
    const [alert, setAlert] = useState<keyof typeof State>();
    const [lang, setLang] = useState<string>();
    const [items, setItems] = useState<ItemType[]>();

    useEffect(() => {
        if (!SUPPORT_SPEECHRECOGNITION) return;

        if (alert !== "END") return;
        const timer = setTimeout(() => setAlert(undefined), 1000);

        return () => clearTimeout(timer);
    }, [alert]);

    useEffect(() => {
        if (!SUPPORT_SPEECHRECOGNITION) return;

        if (active && recognition.current === null) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.lang = lang;
            // @ts-expect-error missing type
            recognition.current.addEventListener("result", (e: SpeechRecognitionEvent) => {
                const resultItem = e.results.item(e.resultIndex);
                const { transcript } = resultItem.item(0);

                preview(transcript);

                if (!resultItem.isFinal) {
                    return;
                }

                editor.update(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        selection.focus.getNode().selectEnd().insertText(transcript);
                    }
                    else {
                        $getRoot().selectEnd().insertParagraph()?.select().insertText(transcript);
                    }
                });
                setActive(false);
            })
        }

        if (recognition.current) {
            if (active) {
                recognition.current.start();
                setAlert("BEGIN");
            } else {
                recognition.current.stop();
                recognition.current = null;
                setAlert("END");
            }
        }

        return () => {
            if (recognition.current !== null) {
                recognition.current.stop();
            }
        }
    }, [active, editor, lang, preview]);

    useEffect(() => {
        if (SUPPORT_SPEECHRECOGNITION || !active) return;

        const timer = setTimeout(() => {
            setActive(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [active]);

    useEffect(() => {
        if (!SUPPORT_SPEECHRECOGNITION) return;

        const synth = window.speechSynthesis;

        synth.addEventListener("voiceschanged", () => {
            const names = Array.from(new Set(synth.getVoices().map(it => it.lang)));
            setItems(names.map(it => ({ label: langcodes[it], key: it })));
            setLang(names[0]);
        })
    }, []);

    return <>
        {
            items ? <Dropdown trigger={["hover"]} placement="bottom"
                menu={{
                    items: items, selectable: true, selectedKeys: [lang!],
                    style: { maxHeight: 250, overflow: "auto" },
                    onSelect: (select) => {
                        setActive(true);
                        setLang(select.key);
                    },
                }}>
                <ToolKitButton icon={<AudioOutlined />} onClick={() => setActive(prev => !prev)}
                    style={{ color: active ? "red" : undefined }} />
            </Dropdown> : <ToolKitButton icon={<AudioOutlined />} onClick={() => setActive(prev => !prev)} />
        }
        {
            active && !SUPPORT_SPEECHRECOGNITION &&
            <Alert closable type="warning" banner message={"此瀏覽器不支持語音辨識"}
                style={alertStyle} />
        }
        {
            alert && <Alert banner type={alert === "BEGIN" ? "success" : "error"}
                message={State[alert]} closable={alert === "END"} onClose={() => setAlert(undefined)}
                style={alertStyle} />
        }
        {context}
    </>
};