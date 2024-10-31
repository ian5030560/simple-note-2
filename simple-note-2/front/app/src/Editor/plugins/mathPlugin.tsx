import { $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical"
import { useCallback, useEffect, useState } from "react";
import { Button, Checkbox, Flex, Form, Input, Space, Typography } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createMathNode } from "../nodes/math";
import { MathRender } from "../nodes/math/component";
import { $contains } from "../utils";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import Modal from "../ui/modal";

type MathFormData = { inline: boolean, content: string };
export default function MathPlugin() {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm<MathFormData>();
    const [editor] = useLexicalComposerContext();
    const [preview, setPreview] = useState("");
    const [node, setNode] = useState<LexicalNode>();

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

    const handleFinish = useCallback((values: MathFormData) => {
        if (values.content?.trim().length > 0) {
            editor.update(() => {
                const math = $createMathNode(values.content, values.inline);
                if (!values.inline) {
                    if (!node) {
                        $getRoot().insertAfter(math);
                    }
                    else {
                        node.insertAfter(math);
                    }
                }
                else {
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
                }
            })
        }

        handleCancel();
    }, [editor, handleCancel, node]);

    return <Modal title="輸入數學" open={open} onCancel={handleCancel}>
        <Form name="math-form" form={form} onFinish={handleFinish} clearOnDestroy
            onValuesChange={(_, values) => setPreview(values.content || "")} autoComplete="off">
            <Form.Item labelCol={{ span: 4 }} label="是否inline" name="inline" valuePropName="checked">
                <Checkbox />
            </Form.Item>
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
            <Typography.Text style={{ textWrap: "nowrap", fontWeight: "bold" }}>預覽</Typography.Text>
            <div style={{ width: "100%", textAlign: "center" }}>
                <MathRender content={preview} inline style={{ fontSize: "2em" }} />
            </div>
        </Flex>
    </Modal>
};