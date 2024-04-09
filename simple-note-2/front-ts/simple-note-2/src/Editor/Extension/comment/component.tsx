import { Button, Card, Flex, Space, theme, Typography, Input } from "antd";
import styles from "./component.module.css";
import { FaRegWindowClose } from "react-icons/fa";
import { MutableRefObject, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { FiDelete } from "react-icons/fi";
import { RiChatDeleteLine } from "react-icons/ri";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import commentTheme from "./theme";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { EditorRefPlugin } from "@lexical/react/LexicalEditorRefPlugin";
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import { EditorState, LexicalEditor } from "lexical";

interface PlainEditorProp {
    onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
    editorRef?: React.RefCallback<LexicalEditor> | MutableRefObject<LexicalEditor | null | undefined>,
}
const PlainEditor = (prop: PlainEditorProp) => {
    const initialConfig = {
        namespace: 'CommentEditor',
        nodes: [],
        onError: (error: Error) => {
            throw error;
        },
        theme: commentTheme,
    };

    return <LexicalComposer initialConfig={initialConfig}>
        <PlainTextPlugin
            contentEditable={<ContentEditable className={styles.commentInput}/>}
            placeholder={<></>}
            ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={prop.onChange ? prop.onChange : () => {}} />
        <HistoryPlugin />
        <ClearEditorPlugin />
        {prop.editorRef !== undefined && <EditorRefPlugin editorRef={prop.editorRef} />}
    </LexicalComposer>

}

interface CommentProp {
    author: string;
    timestamp: number;
    text: string;
}
const Comment = (prop: CommentProp) => {
    let time = prop.timestamp - Date.now();

    return <div>
        <Flex align="baseline" justify="space-between">
            <Title level={3} ellipsis>{prop.author}</Title>
            <Text>{time < 60000 ? "just now" : time - 60000 === 1 ? "1 minute age" : `${time / 60000} minutes`}</Text>
        </Flex>
        <Flex justify="space-between" align="baseline">
            <Paragraph>{prop.text}</Paragraph>
            <Button type="text" icon={<FiDelete />} />
        </Flex>
        <div className={styles.commentInputContainer}>
            <PlainEditor/>
            <Button icon={<IoMdSend />} type="text" className={styles.commentButton} />
        </div>
    </div>
}

type CommentItem = {
    author: string;
    timestamp: number;
    text: string;
}
interface CommentLaneProp {
    items: CommentItem[];
}
const { Title, Text, Paragraph } = Typography;
const CommentLane = (prop: CommentLaneProp) => {
    return <Card title={<Title level={2}>example</Title>}
        extra={<Button icon={<RiChatDeleteLine />} type="text" />}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}>
        {
            prop.items.map((item, index) => <Comment
                key={index}
                author={item.author}
                text={item.text}
                timestamp={item.timestamp}
            />)
        }
    </Card>;
}

export const CommentPool = () => {
    const { token } = theme.useToken();
    const [show, setShow] = useState(true);

    const items: CommentItem[] = [
        {
            author: "wefwef",
            timestamp: 13243200000,
            text: "Hello",
        }
    ]
    return <div className={show ? styles.commentLane : styles.commentLaneHide}
        style={{ backgroundColor: token.colorBgBase }}>
        <Button type="text" icon={<FaRegWindowClose />} onClick={() => setShow(false)} />
        <Space direction="vertical" style={{ width: "100%" }}>
            <CommentLane items={items}/>
        </Space>
    </div>;
}