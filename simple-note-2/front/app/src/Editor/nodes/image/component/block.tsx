import { $getNodeByKey, ElementFormatType } from "lexical";
import ImageView, { ImageViewProps } from ".";
import styles from "./index.module.css";
import { PicLeftOutlined, PicCenterOutlined, PicRightOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useState } from "react";
import { $isBlockImageNode } from "../block";
import CheckOptionGroup from "./checkOptionGroup";
import { Flex } from "antd";
import { CloseButton } from "../../../ui/button";

export interface BlockImageViewProps extends ImageViewProps {
    format?: ElementFormatType;
}

const formats: { key: ElementFormatType, label: React.ReactNode }[] = [
    { key: "left", label: <PicLeftOutlined /> },
    { key: "center", label: <PicCenterOutlined /> },
    { key: "right", label: <PicRightOutlined /> },
]
export default function BlockImageView({ format, ...props }: BlockImageViewProps) {
    const [editor] = useLexicalComposerContext();
    const [hidden, setHidden] = useState(false);

    const handleChange = useCallback((value?: React.Key) => {
        if (!props.nodeKey) return;

        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey!);
            if ($isBlockImageNode(node)) {
                const newValue = (node.getFormat() !== value ? value : undefined) as typeof format | undefined;
                node.setFormat(newValue);
            }
        });
    }, [editor, props.nodeKey]);

    const handleClose = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey!);
            node?.remove();
        })
    }, [editor, props.nodeKey]);

    return <div className={styles.imageContainer}>
        <ImageView {...props} onError={() => setHidden(true)} />
        {!hidden && <Flex className={styles.imageOptionsContainer} gap={8}>
            <CheckOptionGroup value={format} items={formats} onChange={handleChange} />
            <CloseButton onClick={handleClose} />
        </Flex>}
    </div>
}