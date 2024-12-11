import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, CLICK_COMMAND, NodeKey } from "lexical";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import noImage from "../../../../resource/no_image.png";
import { Image } from "antd";
import Resizer from "../../../ui/resizer";
import { $isImageNode } from "..";

export interface ImageViewProps {
    src: string;
    alt: string;
    width: number | "inherit";
    height: number | "inherit";
    nodeKey?: NodeKey;
    onError?: () => void;
}
export default function ImageView({ src, alt, height, width, nodeKey, onError }: ImageViewProps) {
    const [editor] = useLexicalComposerContext();
    const spanRef = useRef<HTMLSpanElement>(null);
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey!);
    const [error, setError] = useState(false);

    const handleResize = useCallback((width: number, height: number) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey!);
            if ($isImageNode(node)) {
                node.setWidth(width);
                node.setHeight(height);
            }
        })
    }, [editor, nodeKey]);

    const handleClick = useCallback((e: MouseEvent) => {
        if (spanRef.current?.contains(e.target as HTMLElement)) {
            setSelected(!isSelected);
        }
        return false;
    }, [isSelected, setSelected]);

    useEffect(() => editor.registerCommand(CLICK_COMMAND, handleClick, 1), [editor, handleClick]);

    return <Resizer onResize={handleResize} showHandle={isSelected}>
        <span ref={spanRef}>
            <Image preview={false} src={!error ? src : noImage} alt={alt} width={width} height={height}
                draggable={false} onError={() => { setError(true); onError?.(); }} />
        </span>
    </Resizer>;
}