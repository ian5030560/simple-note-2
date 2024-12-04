import { Button, ConfigProvider, Dropdown, Flex, Typography } from "antd";
import styles from "./component.module.css";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import React, { forwardRef, useCallback, useState } from "react";
import { $getNodeByKey, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { WithAnchorProps } from "../../ui/action";
import { MenuInfo } from "rc-menu/lib/interface";
import { PLUSMENU_SELECTED } from "./command";

interface LabelProps {
    name: string;
    icon: React.ReactNode;
}
const Label = (props: LabelProps) => <Flex align="center" gap={"middle"}>
    {props.icon}
    <Typography.Text>{props.name}</Typography.Text>
</Flex>;

function convert(items: PlusItem[]) {
    return items.map(({ label, icon, children, ...item }) => ({
        ...item, label: <Label name={label} icon={icon} />,
        children: children ? convert(children) : undefined
    }));
}

export interface PlusItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    children?: PlusItem[];
}
interface DragHandlerProps extends WithAnchorProps {
    pos: { x: number, y: number };
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
    items: PlusItem[];
    nodeKey: NodeKey;
    overlayContainer: HTMLElement | null;
}
export const DragHandler = forwardRef((props: DragHandlerProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();

    const block = useCallback(() => props.overlayContainer?.style.removeProperty("pointer-events"), [props.overlayContainer?.style]);
    const unblock = useCallback(() => props.overlayContainer?.style.setProperty("pointer-events", "none"), [props.overlayContainer?.style]);

    const handleOpenChange = useCallback((value: boolean) => {
        if (!value) {
            unblock();
        }
        else {
            block();
        }
        setOpen(value);
    }, [block, unblock]);

    const handleSelect = useCallback((info: MenuInfo) => {
        const node = editor.read(() => $getNodeByKey(props.nodeKey));
        if (!node) return;
        editor.dispatchCommand(PLUSMENU_SELECTED, { node, value: info.key });
    }, [editor, props.nodeKey]);

    return <div className={styles.draggable} draggable={true} tabIndex={-1}
        onDragStart={props.onDragStart} onDragEnd={props.onDragEnd} ref={ref}
        style={{ transform: props.pos ? `translate(calc(${props.pos.x - 8}px - 100%), calc(${props.pos.y}px - 50%))` : undefined }}>

        <ConfigProvider theme={{ token: { fontSize: 18 } }}>
            <Dropdown open={open} menu={{ items: convert(props.items), onClick: handleSelect }} 
                placement="bottomLeft" trigger={["click"]} onOpenChange={handleOpenChange}
                getPopupContainer={() => props.overlayContainer || document.body}
                overlayClassName={styles.dropDown}>
                <Button size="large" contentEditable={false} type="text" icon={<PlusOutlined />} />
            </Dropdown>
        </ConfigProvider>

        <Button size="large" className={styles.handleButton} contentEditable={false} type="text" icon={<HolderOutlined />} />
    </div>
});

interface DragLineProps {
    pos: { x: number, y: number };
    size: { width: number, height: number };
}
export const DragLine = ({ pos, size }: DragLineProps) => {

    return <div className={styles.dropLine} style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        width: size.width, height: size.height
    }} />
}