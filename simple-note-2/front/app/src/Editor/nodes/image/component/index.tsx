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
}
export default function ImageView({ src, alt, height, width, nodeKey }: ImageViewProps) {
    const [editor] = useLexicalComposerContext();
    const imageRef = useRef<HTMLSpanElement>(null);
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
        if (imageRef.current?.contains(e.target as HTMLElement)) {
            setSelected(!isSelected);
        }
        return false;
    }, [isSelected, setSelected]);

    useEffect(() => {
        const { current: image } = imageRef;
        if (!image) return;

        const handleLoad = () => setError(false);
        const handleError = () => setError(true);

        image.addEventListener("load", handleLoad);
        image.addEventListener("error", handleError);

        return () => {
            image.removeEventListener("load", handleLoad);
            image.removeEventListener("error", handleError);
        }
    }, []);

    useEffect(() => {
        return editor.registerCommand(CLICK_COMMAND, handleClick, 1);
    }, [editor, handleClick]);

    return <>
        {
            error ? <Image draggable={false} src={noImage} preview={false} alt={alt}
                width={width} height={height} /> :
                <Resizer onResize={handleResize} showHandle={isSelected}>
                    <span ref={imageRef}>
                        <Image preview={false} src={src} alt={alt} width={width} height={height} draggable={false} />
                    </span>
                </Resizer>
        }
    </>;
}