import { Button, Card, Drawer, Flex, Input, Space, Timeline, Typography } from "antd";
import { useEffect, useState } from "react";
import { MinusOutlined, SendOutlined } from "@ant-design/icons";
import { createCommand, LexicalCommand } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface CommentItemProps {
    author: string;
    timestamp: number;
    content: string;
    onDelete: () => void;
}
function CommentItem(props: CommentItemProps) {
    const [timestamp, setTimestamp] = useState(props.timestamp);

    return <Flex vertical>
        <Flex justify="space-between" align="center">
            <Space size={"small"}>
                <h3>{props.author}</h3>
                <Typography.Text type="secondary">{timestamp.toString()}</Typography.Text>
            </Space>
            <Button type="text" icon={<MinusOutlined />} onClick={props.onDelete} />
        </Flex>
        <Typography.Text>{props.content}</Typography.Text>
    </Flex>
}

export type CommentItemMap = Record<string, Omit<CommentItemProps, "onDelete">>;
interface CommentCardProps {
    id: string;
    selectedText: string;
    onDelete: () => void;
    itemMap: CommentItemMap;
    onDeleteItem: (id: string) => void;
    onSubmmit: (text: string, id: string) => void;
}
function CommentCard(props: CommentCardProps) {
    const [input, setInput] = useState("");

    return <Card title={props.selectedText} extra={<Button icon={<MinusOutlined />}
        type="text" onClick={props.onDelete} />} style={{ width: "100%" }}>
        <Timeline mode="left"
            items={Object.keys(props.itemMap).map((key) => {
                const item = props.itemMap[key];
                return {
                    children: <CommentItem author={item.author}
                        timestamp={item.timestamp}
                        content={item.content}
                        onDelete={() => props.onDeleteItem(key)}
                    />
                }
            })}
        />
        <div style={{ position: "relative" }}>
            <Input.TextArea autoSize value={input} onChange={(e) => setInput(e.target.value)} />
            <Button type="text" icon={<SendOutlined />}
                style={{ position: "absolute", right: 0, bottom: 0 }}
                onClick={() => {
                    setInput("");
                    props.onSubmmit(input, props.id);
                }}
            />
        </div>
    </Card>
}

export type CommentCardMap = Record<string, Omit<CommentCardProps, "onDelete" | "onDeleteItem" | "onSubmmit">>;

export const TOGGLE_COMMENTSIDER: LexicalCommand<void> = createCommand();
interface CommentSiderProps {
    cards: CommentCardMap;
    onDeleteCard: (id: string) => void;
    onDeleteCardItem: (cid: string, id: string) => void;
    onSubmmit: (text: string) => void;
}
export function CommentSider(props: CommentSiderProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        editor.registerCommand(TOGGLE_COMMENTSIDER, () => {
            setOpen(prev => !prev);
            return true;
        }, 4)
    }, [editor]);

    return <Drawer title="評論" mask={false} maskClosable={false}
        open={open} onClose={() => setOpen(false)}>
        <Space direction="vertical">
            {
                Object.keys(props.cards).map(key => {
                    const card = props.cards[key];
                    return <CommentCard
                        key={key} id={key}
                        selectedText={card.selectedText}
                        itemMap={card.itemMap}
                        onDelete={() => props.onDeleteCard(key)}
                        onDeleteItem={(id) => props.onDeleteCardItem(key, id)}
                        onSubmmit={() => props.onSubmmit}
                    />
                })
            }
        </Space>
    </Drawer>
}