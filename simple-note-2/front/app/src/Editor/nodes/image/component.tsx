import React, { useCallback, useEffect, useRef, useState } from "react";
import ImageNode, { ImageNodeProp } from ".";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, CLICK_COMMAND } from "lexical";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import Resizer from "../../ui/resizer";
import noImage from "../../../resource/no_image.png";
import { Image } from "antd";

type ImageProp = ImageNodeProp;
const ImageView: React.FC<ImageProp> = ({ src, alt, height, width, nodeKey }) => {
    const [editor] = useLexicalComposerContext();

    const imageRef = useRef<HTMLImageElement>(null);
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey!);
    const [error, setError] = useState(false);

    const handleResize = useCallback((width: number, height: number) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey!)! as ImageNode;
            node.setWidth(width);
            node.setHeight(height);
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
        {error ? <Image draggable={false} src={noImage} preview={false} alt={alt}
            width={width} height={height} /> : <Resizer onResize={handleResize} showHandle={isSelected}>
            <img src={src} alt={alt} ref={imageRef} width={width} height={height} />
        </Resizer>}
    </>;
}

export default ImageView;