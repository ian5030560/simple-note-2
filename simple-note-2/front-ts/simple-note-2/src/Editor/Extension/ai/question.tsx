import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Plugin } from "..";
import { ChatSession, GoogleGenerativeAI, } from "@google/generative-ai";
import { LexicalCommand, createCommand } from "lexical";
import { useRef, useState, useEffect, useCallback } from "react";
import { Button, Drawer, Flex, Input, theme, Typography } from "antd";
import { RobotOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { uuid } from "../../../util/secret";
import useGenimi from "./useGenimi";

interface MessageProps {
    icon: React.ReactNode;
    content: string;
    style: React.CSSProperties;
    bodyStyle: React.CSSProperties;
    headStyle: React.CSSProperties;
}
const Message = (props: MessageProps) => {
    return <Flex style={props.style} gap={"small"}>
        <span style={props.headStyle}>{props.icon}</span>
        <pre style={props.bodyStyle}>{props.content}</pre>
    </Flex>
}

export const TOGGLE_QUESTION_TO_AI: LexicalCommand<void> = createCommand();
export const AIQuestionPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const model = useGenimi();
    const session = useRef<ChatSession>();
    const [open, setOpen] = useState(false);
    const { token } = theme.useToken();
    const [history, setHistory] = useState<{ id: string, role: "user" | "model", content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState<string>("");
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!model) return;
        session.current = model.startChat();
    }, [model]);
    
    // useEffect(() => {
    //     const API_KEY = "AIzaSyDXlilZA6flQCDThnj7qRd4gunxZIWl1Po";
    //     session.current = new GoogleGenerativeAI(API_KEY)
    //         .getGenerativeModel({ model: "gemini-1.5-flash", tools: [{ codeExecution: {} }] })
    //         .startChat();
    // }, []);

    useEffect(() => {
        return editor.registerCommand(TOGGLE_QUESTION_TO_AI, () => {
            setOpen(prev => !prev);
            return true;
        }, 4);
    }, [editor]);

    useEffect(() => {
        if (loading || !ref.current) return;
        let element = ref.current;
        element.scrollTo(0, element.scrollHeight);
    }, [loading]);

    const handleClick = useCallback(async () => {
        if (!session.current) return;

        let content = input;
        let chat = session.current;
        if (content.trim().length > 0) {
            setInput("");
            setHistory(prev => [...prev, { id: uuid(), role: "user", content: content! }]);
            setLoading(true);

            let id = uuid();
            setHistory(prev => [...prev, { id: id, role: "model" as "model", content: "" }]);
            // chat.sendMessage(input)
            //     .then(res => res.response)
            //     .then(res => res.candidates)
            //     .then(console.log)
            //     .then(() => setLoading(false))
            //     .catch(() => null);
            chat.sendMessageStream(input)
                .then(res => res.stream)
                .then(async stream => {
                    for await (const chunk of stream) {
                        setHistory(prev => {
                            let index = prev.findIndex(it => it.id === id)!;
                            prev[index].content += chunk.text();
                            return [...prev];
                        })
                    }
                })
                .then(() => setLoading(false))
                .then(() => null);
        }
    }, [input]);

    return <Drawer open={open} onClose={() => setOpen(false)} title="詢問AI"
        mask={false} maskClosable={false}>
        <Flex vertical justify="space-between" style={{ height: "100%" }} gap={"small"}>
            <div ref={ref} style={{
                flex: 1, overflow: "auto", display: "flex",
                gap: 10, flexDirection: "column"
            }}>
                {
                    history.map(it => <Message content={it.content} key={it.id}
                        icon={it.role === "user" ? <UserOutlined /> : <RobotOutlined />}
                        style={{
                            direction: it.role === "user" ? "rtl" : "ltr",
                            backgroundColor: token.colorFillSecondary,
                            borderRadius: 8, padding: 8
                        }}
                        bodyStyle={{ textWrap: "wrap", direction: "ltr" }}
                        headStyle={{
                            backgroundColor: token.colorPrimary, borderRadius: 8,
                            height: "max-content", padding: 8,
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