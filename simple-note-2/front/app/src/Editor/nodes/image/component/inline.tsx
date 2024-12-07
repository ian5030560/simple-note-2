import ImageView, { ImageViewProps } from ".";
import { $isInlineImageNode, Float } from "../inline";
import styles from "./index.module.css";
import { PicLeftOutlined, PicRightOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback } from "react";
import { $getNodeByKey } from "lexical";
import CheckOptionGroup from "./checkOptionGroup";

interface InlineImageViewProps extends ImageViewProps {
    float?: Float;
}

const floats: { key: Float, label: React.ReactNode }[] = [
    { key: "left", label: <PicLeftOutlined /> },
    { key: "right", label: <PicRightOutlined /> }
]
export default function InlineImageView({ float, ...props }: InlineImageViewProps) {
    const [editor] = useLexicalComposerContext();

    const handleChange = useCallback((value?: React.Key) => {
        if (!props.nodeKey) return;

        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey!);
            if ($isInlineImageNode(node)) {
                const newValue = (value !== node.getFloat() ? value : undefined) as Float | undefined;
                node.setFloat(newValue);
            }
        });
    }, [editor, props.nodeKey]);

    return <div className={styles.imageContainer}>
        <ImageView {...props} />
        <CheckOptionGroup className={styles.imageOptionsContainer} value={float}
            items={floats} onChange={handleChange}/>
    </div>
}