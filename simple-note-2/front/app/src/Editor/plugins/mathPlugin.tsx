import { $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical"
import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Form, Input, Space, Typography } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import MathNode, { $createMathNode } from "../nodes/math";
import { MathRender } from "../nodes/math/component";
import { $contains, useValidateNodeClasses } from "../utils";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import Modal from "../ui/modal";

type MathData = { inline: boolean, content: string };
export default function MathPlugin() {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm<MathData>();
    const [editor] = useLexicalComposerContext();
    const [preview, setPreview] = useState("");
    const [node, setNode] = useState<LexicalNode>();

    useValidateNodeClasses([MathNode]);

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
        if (value === "math") {
            setNode(node);
            setOpen(true);
        }

        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    const handleCancel = useCallback(() => {
        setOpen(false);
        setPreview("");
        form.resetFields();
    }, [form]);

    const handleFinish = useCallback((values: MathData) => {
        if (values.content?.trim().length > 0) {
            editor.update(() => {
                const math = $createMathNode(values.content, values.inline);
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) {
                    $getRoot().selectEnd().insertParagraph()?.selectStart().insertNodes([math]);
                }
                else {
                    const offset = selection.focus.offset;
                    const focus = selection.focus.getNode();

                    if (!node || $contains(node, focus)) {
                        focus.select(offset).insertNodes([math]);
                    }
                    else {
                        node.selectEnd().insertNodes([math]);
                    }
                }
            })
        }

        handleCancel();
    }, [editor, handleCancel, node]);

    return <Modal title="輸入數學" open={open} onCancel={handleCancel}>
        <Form name="math-form" form={form} onFinish={handleFinish} clearOnDestroy
            onValuesChange={(_, values) => setPreview(values.content || "")} autoComplete="off">
            <Form.Item label="內容" name="content" labelCol={{ span: 4 }}>
                <Input.TextArea variant="filled" autoSize />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 4 }}>
                <Space size="small">
                    <Button type="primary" htmlType="submit"
                        onClick={() => {
                            const content = form.getFieldValue("content") as string | undefined;
                            if (!content || content.trim().length === 0) handleCancel();
                        }}>提交</Button>
                    <Button type="text" onClick={handleCancel}>取消</Button>
                </Space>
            </Form.Item>
        </Form>

        <Flex>
            <Typography.Title level={4} style={{ textWrap: "nowrap", fontWeight: "bold", alignSelf: "start", marginTop: 0 }}>預覽</Typography.Title>
            <div style={{ width: "100%", textAlign: "center", overflow: "auto"}}>
                <MathRender content={preview} inline style={{ fontSize: "2em" }} />
            </div>
        </Flex>
    </Modal>
};