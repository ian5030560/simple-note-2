import { AudioOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ToolKitButton } from "./ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Typography } from "antd";
import { $getSelection, $isRangeSelection } from "lexical";
import { createPortal } from "react-dom";

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
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SUPPORT_SPEECHRECOGNITION = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

const State = {
    BEGIN: "開始錄音",
    END: "錄音結束"
}
export default function SpeechToText() {
    const [editor] = useLexicalComposerContext();
    const recognition = useRef<SpeechRecognition | null>(null);
    const [active, setActive] = useState(false);
    const [preview, context] = usePreview(500);
    const [alert, setAlert] = useState<keyof typeof State>();

    useEffect(() => {
        if(alert !== "END") return;
        const timer = setTimeout(() => setAlert(undefined), 1000);

        return () => clearTimeout(timer);
    }, [alert]);

    useEffect(() => {
        if (active && recognition.current === null) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
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
                        if (transcript.match(/\s*\n\s*/)) {
                            selection.insertParagraph();
                        } else {
                            selection.insertText(transcript);
                        }
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
    }, [active, editor, preview]);

    return <>
        <ToolKitButton icon={<AudioOutlined />} onClick={() => setActive(prev => !prev)}
            style={{ color: active ? "red" : undefined }} />
        {
            active && !SUPPORT_SPEECHRECOGNITION &&
            <Alert closable type="warning" banner message={"此瀏覽器不支持語音辨識"} />
        }
        {
            alert && <Alert banner type={alert === "BEGIN" ? "success" : "error"}
                message={State[alert]} closable={alert === "END"} onClose={() => setAlert(undefined)}
                style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)" }} />
        }
        {context}
    </>
};