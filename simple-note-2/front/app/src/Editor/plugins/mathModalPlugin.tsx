import { $getRoot, $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, LexicalNode } from "lexical"
import { useCallback, useEffect, useState } from "react";
import { Button, Flex, Input, Typography } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { SendOutlined } from "@ant-design/icons";
import BlockMathNode, { $createBlockMathNode } from "../nodes/math/block";
import { MathRender } from "../nodes/math/component";
import InlineMathNode, { $createInlineMathNode } from "../nodes/math/inline";
import { useValidateNodeClasses, $contains } from "../utils";
import { PLUSMENU_SELECTED } from "./draggablePlugin/command";
import Modal from "../ui/modal";

export default function MathModalPlugin() {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const [node, setNode] = useState<LexicalNode>();
    const [input, setInput] = useState<string>();
    const [inline, setInline] = useState(false);

    useValidateNodeClasses([BlockMathNode, InlineMathNode]);

    useEffect(() => editor.registerCommand(PLUSMENU_SELECTED, ({ node, keyPath }) => {
        if (keyPath[0] === "math") {
            setNode(node);
            setOpen(true);
            setInline(keyPath[1] === "inline");
        }
        return false;
    }, COMMAND_PRIORITY_CRITICAL), [editor]);

    const clear = useCallback(() => {
        setOpen(false);
        setInput(undefined);
        setInline(false);
    }, []);

    const $insertInline = useCallback(() => {
        const math = $createInlineMathNode(input!);
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
    }, [input, node]);

    const $insertBlock = useCallback(() => {
        const math = $createBlockMathNode(input!);
        const selection = $getSelection();
        if(!$isRangeSelection(selection)){
            $getRoot().selectEnd().insertNodes([math]);
        }
        else{
            node?.insertAfter(math);
        }
        math.selectEnd();
    }, [input, node]);

    const handleClick = useCallback(() => {
        if (input && input.trim().length > 0) {
            editor.update(() => {
                if (!inline) {
                    $insertBlock();
                }
                else {
                    $insertInline();
                }
            });
        }
        clear();
    }, [$insertBlock, $insertInline, clear, editor, inline, input]);

    return <Modal title="輸入數學" open={open} onCancel={clear}>
        <Flex vertical gap={8}>
            <Flex align="end" gap={8}>
                <Input.TextArea variant="filled" autoComplete="off" autoSize value={input} style={{ flex: 1 }}
                    onChange={(e) => setInput(e.target.value)} />
                <Button type="primary" icon={<SendOutlined />} onClick={handleClick}>提交</Button>
            </Flex>
            <Flex>
                <Typography.Title level={4} style={{ marginTop: 0 }}>預覽</Typography.Title>
                <div style={{ flex: 1, textAlign: "center", overflow: "auto" }}>
                    {input && <MathRender content={input} inline style={{ fontSize: "2em" }} />}
                </div>
            </Flex>
        </Flex>
    </Modal>
};