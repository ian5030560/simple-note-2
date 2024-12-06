import { Button, Space } from "antd";
import ImageView, { ImageViewProps } from ".";
import { $isInlineImageNode, Float } from "../inline";
import styles from "./index.module.css";
import { PicLeftOutlined, PicRightOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import { $getNodeByKey } from "lexical";

interface InlineImageViewProps extends ImageViewProps {
    float?: Float;
}

const floats: { key: Float, icon: React.ReactNode }[] = [
    { key: "left", icon: <PicLeftOutlined /> },
    { key: "right", icon: <PicRightOutlined /> }
]
export default function InlineImageView(props: InlineImageViewProps) {
    const [editor] = useLexicalComposerContext();

    const handleSelect = useCallback((key: Float) => {
        if(!props.nodeKey) return;

        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey!);
            if($isInlineImageNode(node)){
                node.setFloat(key !== node.getFloat() ? key : undefined);
            }
        });
    }, [editor, props.nodeKey]);

    return <div className={styles.imageContainer}>
        <ImageView {...props} />
        <Space className={styles.imageOptionsContainer}>
            {
                floats.map(float => <Button key={float.key} type={props.float === float.key ? "primary" : "text"}
                icon={float.icon} onClick={() => handleSelect(float.key)}/>)
            }
        </Space>
    </div>
}