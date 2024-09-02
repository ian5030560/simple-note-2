import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { LexicalCommand, createCommand } from "lexical";
import { useRef, useState, useEffect, useCallback } from "react";
import { Button, Drawer, Flex, Input, Skeleton, theme, Typography } from "antd";
import { RobotOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { uuid } from "../../../util/secret";
import useGemini from "./useGemini";

interface MessageProps {
    icon: React.ReactNode;
    content: React.ReactNode;
    style: React.CSSProperties;
    bodyStyle: React.CSSProperties;
    headStyle: React.CSSProperties;
    loading?: boolean;
}
const Message = (props: MessageProps) => {
    return <Flex style={props.style} gap={"small"}>
        <span style={props.headStyle}>{props.icon}</span>
        {
            props.loading ? <Skeleton active loading /> :
                <Typography.Text style={props.bodyStyle}>{props.content}</Typography.Text>
        }
    </Flex>
}

// function text2html(content: string): React.ReactNode {
//     content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
//         return part.startsWith("**") && part.endsWith("**") ?
//             <b key={index}>{part.slice(2, -2)}</b> : part;
//     });
//     return;
// }
export const TOGGLE_QUESTION_TO_AI: LexicalCommand<void> = createCommand();
export const AIQuestionPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const model = useGemini();
    const [open, setOpen] = useState(false);
    const { token } = theme.useToken();
    const [history, setHistory] = useState<{ id: string, role: "user" | "model", content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState<string>("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        return editor.registerCommand(TOGGLE_QUESTION_TO_AI, () => {
            setOpen(prev => !prev);
            return true;
        }, 4);
    }, [editor]);


    useEffect(() => {
        let el = ref.current;
        if (!el) return;

        let observer = new MutationObserver(() => {
            el && el.scrollTo(0, el.scrollHeight);
        });
        observer.observe(el, { childList: true });

        return () => observer.disconnect();
    }, []);

    const handleClick = useCallback(async () => {
        if (!model) return;

        let content = input;
        let chat = model.startChat({
            history: history.map(it => ({
                role: it.role,
                parts: [{ text: it.content }]
            }))
        });

        if (content.trim().length > 0) {
            setInput("");
            setLoading(true);

            let id = uuid()
            setHistory(prev => prev.concat(
                { id: uuid(), role: "user", content: content! },
                { id: id, role: "model", content: "" }
            ));

            chat.sendMessage(input)
                .then(res => res.response.text())
                .then(text => {
                    setHistory(prev => {
                        let index = prev.findIndex(it => it.id === id);
                        prev[index].content = text;
                        return [...prev];
                    })
                    setLoading(false);
                })
                .catch(() => null);
        }
    }, [history, input, model]);

    return <Drawer open={open} onClose={() => setOpen(false)} title="詢問AI" mask={false} maskClosable={false}>
        <Flex vertical justify="space-between" style={{ height: "100%" }} gap={"small"}>
            <div ref={ref} style={{
                flex: 1, overflow: "auto", display: "flex",
                gap: 10, flexDirection: "column"
            }}>
                {
                    history.map(it => <Message key={it.id}
                        content={it.content.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                            return part.startsWith("**") && part.endsWith("**") ?
                                <b key={index}>{part.slice(2, -2)}</b> : part;
                        })}
                        loading={it.content === ""}
                        icon={it.role === "user" ? <UserOutlined /> : <RobotOutlined />}
                        style={{
                            backgroundColor: token.colorFillSecondary,
                            borderRadius: 8, padding: 8
                        }}
                        bodyStyle={{ textWrap: "wrap", direction: "ltr", whiteSpace: "pre-wrap", alignSelf: "center" }}
                        headStyle={{
                            backgroundColor: token.colorBgElevated, borderRadius: 8,
                            height: "fit-content", width: "fit-content", padding: 8,
                        }} />
                    )
                }
            </div>
            <div style={{ position: "relative" }}>
                <Input.TextArea style={{ resize: "none", overflow: "auto" }} value={input}
                    onChange={(e) => setInput(e.target.value)} variant="filled" disabled={loading} />
                <Button type="text" icon={<SendOutlined />} loading={loading}
                    style={{ position: "absolute", right: 3, bottom: 3 }}
                    onClick={handleClick} />
            </div>
        </Flex>
    </Drawer>;
}