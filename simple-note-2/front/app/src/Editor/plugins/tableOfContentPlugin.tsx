import { createCommand, LexicalCommand } from "lexical";
import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin';
import { Drawer, Flex, Space, theme, Typography } from "antd";
import styles from "./tableOfContentPlugin.module.css";
import { HeadingTagType } from "@lexical/rich-text"

function indent(tag: HeadingTagType) {
    const sliced = tag.slice(1);
    return parseInt(sliced);
}
export const TABLE_OF_CONTENT: LexicalCommand<void> = createCommand();
export default function TableOfContentPlugin() {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const [selected, setSelected] = useState<string>();
    const { token } = theme.useToken();

    useEffect(() => {
        return editor.registerCommand(TABLE_OF_CONTENT, () => {
            setOpen(prev => !prev);
            return true;
        }, 4)
    }, [editor]);

    const handleSelected = useCallback((key: string) => {
        const element = editor.getElementByKey(key);
        if (!element) return;

        setSelected(key);
        element.scrollIntoView();
    }, [editor]);

    return <TableOfContentsPlugin>
        {
            (tableContent) => <Drawer open={open} mask={false} maskClosable={false}
                onClose={() => setOpen(false)} title="內容目錄">
                <Flex style={{ overflowY: "auto" }} gap={"small"}>
                    <div className={styles.tableOfContentAlignLine} style={{ backgroundColor: token.colorTextSecondary }} />
                    <Space direction="vertical" size={"small"}>
                        {
                            tableContent.map(([key, text, tag]) => text.trim().length > 0 ? <div key={key} className={styles.tableOfContentItem}
                                style={{ paddingLeft: `${(indent(tag) - 1) * 2}em` }} tabIndex={-1}
                                onClick={() => handleSelected(key)}>
                                <Typography.Title level={5} type={selected !== key ? "secondary" : undefined}
                                    style={{ margin: 0, transition: "color 250ms ease" }}>
                                    {text}
                                </Typography.Title>
                            </div> : null)
                        }
                    </Space>
                </Flex>
            </Drawer>
        }
    </TableOfContentsPlugin>;
}