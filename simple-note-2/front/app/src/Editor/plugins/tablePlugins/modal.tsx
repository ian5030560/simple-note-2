import { Button, Form, InputNumber, Space } from "antd";
import { useCallback, useEffect, useState } from "react";
import { $createParagraphNode, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { PLUSMENU_SELECTED } from "../draggablePlugin/command";
import Modal from "../../ui/modal";

type TableData = {
    row: number;
    col: number;
}
export default function TableModalPlugin() {

    const [editor] = useLexicalComposerContext();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [node, setNode] = useState<LexicalNode>();

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({ node, value }) => {
        if (value === "table") {
            setOpen(true);
            setNode(node);
        }
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    const handleFinish = useCallback((values: TableData) => {
        const row = values.row;
        const col = values.col;

        editor.update(() => {
            const table = $createTableNodeWithDimensions(Number(row), Number(col), false);
            if (!node) {
                $insertNodeToNearestRoot(table);
            }
            else {
                node.insertAfter(table);
            }
            table.insertAfter($createParagraphNode());
        });
        setOpen(false);

    }, [editor, node]);

    return <Modal title="插入表格" open={open} onCancel={() => setOpen(false)}
        modalRender={(children) => <Form form={form} name="table-form" onFinish={handleFinish}
            initialValues={{ row: 3, col: 3 }} clearOnDestroy>{children}</Form>}>
        <Form.Item label="列數:" name="row">
            <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="欄數:" name="col">
            <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
            <Space size={"small"} style={{width: "100%"}} dir="rtl">
                <Button htmlType="reset">重設</Button>
                <Button type="primary" htmlType="submit">插入</Button>
            </Space>
        </Form.Item>
    </Modal>
}