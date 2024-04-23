import { Button, Card, Flex, Input, Space, theme, Typography } from "antd";
import styles from "./component.module.css";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { FiDelete } from "react-icons/fi";
import { RiChatDeleteLine } from "react-icons/ri";
import makeTimeString from "./time";
import { TextAreaRef } from "antd/es/input/TextArea";

interface CommentProp {
    author: string;
    timestamp: number;
    text: string;
    // onDelete: () => void;
}
const Comment = (prop: CommentProp) => {
    let time = Date.now() - prop.timestamp;

    return <div>
        <Flex align="baseline" justify="space-between">
            <Title level={4} ellipsis style={{ marginTop: 0 }}>{prop.author}</Title>
            <Text>{makeTimeString(time)}</Text>
        </Flex>
        <Flex justify="space-between" align="baseline">
            <Paragraph>{prop.text}</Paragraph>
            <Button type="text" icon={<FiDelete />} />
             {/* onClick={() => prop.onDelete()}/> */}
        </Flex>
    </div>
}

type CommentItem = {
    author: string;
    timestamp: number;
    text: string;
}
interface CommentLaneProp {
    id: string;
    title: string;
    items: CommentItem[];
    // onDelete: (id: string) => void;
    onAdd: (text: string) => void;
}
const { Title, Text, Paragraph } = Typography;
const CommentLane = (prop: CommentLaneProp) => {
    const ref = useRef<TextAreaRef>(null);

    return <Card title={<Title level={3} style={{ marginTop: 0 }}>{prop.title}</Title>}
        extra={<Button icon={<RiChatDeleteLine size={16} />} type="text" />}
        bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
        headStyle={{ minHeight: 0 }}>
        {
            prop.items.map((item, index) => <Comment
                key={prop.title + index}
                author={item.author}
                text={item.text}
                timestamp={item.timestamp}
                // onDelete={() => prop.onDelete(prop.id + index)}
            />)
        }
        <div className={styles.commentInputContainer}>
            <Input.TextArea style={{resize: "none"}} autoSize ref={ref}/>
            <Button icon={<IoMdSend />} type="text" className={styles.commentButton} 
            onClick={() => {
                if(!ref.current) return;
                let text = ref.current.resizableTextArea!.textArea.value;
                prop.onAdd(text);
                ref.current.resizableTextArea!.textArea.value = "";
            }}/>
        </div>
    </Card>;
}

type CommentItemSet = Array<Omit<CommentLaneProp, "onAdd">>;
type PoolRef = {
    open: () => void;
    close: () => void;
}
interface CommentPoolProp{
    items: CommentItemSet;
    onAdd: (id: string, text: string) => void;
    // onDelete: (id: string) => void;
}
const CommentPool = forwardRef(({ items, onAdd }: CommentPoolProp, ref: React.Ref<PoolRef>) => {
    const { token } = theme.useToken();
    const [show, setShow] = useState(true);

    useImperativeHandle(ref, () => ({
        open: () => setShow(true),
        close: () => setShow(false),
    }), []);

    return <div className={show ? styles.commentLane : styles.commentLaneHide}
        style={{ backgroundColor: token.colorBgBase }}>
        <button type="button" onClick={() => setShow(false)}
            className={styles.commentCloseButton}>x</button>
        <Space direction="vertical" style={{ width: "100%" }}>
            {
                items.map((item) => <CommentLane key={item.id} title={item.title} id={item.id}
                items={item.items} onAdd={(text) => onAdd(item.id, text)}/>)
            }
        </Space>
    </div>;
})

export default CommentPool;