import { $getNodeByKey, ElementFormatType } from "lexical";
import ImageView, { ImageViewProps } from "../component";
import styles from "./index.module.css";
import { Button, Space } from "antd";
import { PicLeftOutlined, PicCenterOutlined, PicRightOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import { $isBlockImageNode } from "../block";

export interface BlockImageViewProps extends ImageViewProps {
    format?: ElementFormatType;
}

const formats: { key: ElementFormatType, icon: React.ReactNode }[] = [
    { key: "left", icon: <PicLeftOutlined /> },
    { key: "center", icon: <PicCenterOutlined /> },
    { key: "right", icon: <PicRightOutlined /> },
]
export default function BlockImageView({ format, ...props }: BlockImageViewProps) {
    const [editor] = useLexicalComposerContext();

    const handleSelect = useCallback((value: typeof format) => {
        if(!props.nodeKey) return;

        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey!);
            if($isBlockImageNode(node)){
                node.setFormat(node.getFormat() !== value ? value : undefined);
            }
        });
    }, [editor, props.nodeKey]);

    return <div className={styles.imageContainer}>
        <ImageView {...props} />
        <Space className={styles.imageOptionsContainer}>
            {formats.map(it => <Button key={it.key} type={it.key === format ? "primary" : "text"}
                icon={it.icon} onClick={() => handleSelect(it.key)} />)}
        </Space>
    </div>
}