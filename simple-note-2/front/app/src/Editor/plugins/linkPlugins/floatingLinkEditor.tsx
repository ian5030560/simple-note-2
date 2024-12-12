import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { InputRef, theme, Flex, Typography, Input, Button } from "antd";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_CRITICAL, NodeKey } from "lexical";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";
import { useState, useRef, useCallback, useEffect } from "react";
import Action, { WithAnchorProps } from "../../ui/action";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import styles from "./floatingLinkEditor.module.css";
import { DeleteOutlined } from "@ant-design/icons";
import { PencilSquare } from "react-bootstrap-icons";

type FloatingEditorLinkPluginProps = WithAnchorProps;
export default function FloatingEditorLinkPlugin(props: FloatingEditorLinkPluginProps) {
    const [url, setUrl] = useState<string>();
    const [editable, setEditable] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const [editor] = useLexicalComposerContext();
    const { token } = theme.useToken();
    const [nodeKey, setNodeKey] = useState<NodeKey>();
    const [show, setShow] = useState(false);

    const clear = useCallback(() => {
        setUrl(undefined);
        setEditable(false);
        setShow(false);
    }, []);

    const $updateLinkEditor = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            for (let node of nodes) {
                const p = $isLinkNode(node) ? node : $findMatchingParent(node, $isLinkNode);
                if ($isLinkNode(p)) {
                    setNodeKey(p.getKey());
                    setUrl(p.getURL());
                    setShow(true);
                    return;
                }
            }
        }
        clear();
    }, [clear]);

    useEffect(() => mergeRegister(
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            $updateLinkEditor();
            return false;
        }, COMMAND_PRIORITY_CRITICAL),
    ), [$updateLinkEditor, editor]);

    const handleEdit = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (editable) {
            const url = inputRef.current!.input!.value;
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
            setUrl(url);
        }
        setEditable(prev => !prev);
    }, [editable, editor]);

    const handleDiscard = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        clear();
    }, [clear, editor]);

    return <Action nodeKey={nodeKey} open={show} placement="bottom" anchor={props.anchor} offset={8}>
        <Flex style={{ backgroundColor: token.colorBgBase }}
            className={styles.floatingLinkEditor} align="center" gap={"small"}>
            <Typography.Link target="_blank" rel="noopener noreferrer" href={url}
                style={{ display: !editable ? undefined : "none" }}>{url}</Typography.Link>
            <Input type="url" ref={inputRef} style={{ display: editable ? undefined : "none" }} />
            <Flex gap={"small"}>
                <Button type={editable ? "primary" : "default"} icon={<PencilSquare />} onClick={handleEdit} />
                <Button icon={<DeleteOutlined />} onClick={handleDiscard} />
            </Flex>
        </Flex>
    </Action>
}