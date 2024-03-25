import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ImageNode, { ImageNodeProp } from "./node";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, CLICK_COMMAND } from "lexical";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import styles from "./component.module.css";
import { RiEdit2Fill } from "react-icons/ri";
import { OPEN_CANVAS } from "../canvas/plugin";
import { Button } from "antd";
import Resizer from "../UI/resizer";

type ImageProp = ImageNodeProp;
const ImageView: React.FC<ImageProp> = ({ src, alt, height, width, nodeKey }) => {
    const [editor] = useLexicalComposerContext();
    const sizeRef = useRef<{ width: number, height: number }>();
    const imageRef = useRef<HTMLImageElement>(null);
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey!);

    const MAX = useMemo(() => editor.getRootElement()?.getBoundingClientRect().width, [editor]);

    const handleStart = useCallback(() => {
        const image = imageRef.current!;
        sizeRef.current = { width: image.width, height: image.height };
    }, []);

    const handleResize = useCallback((offsetWidth: number, offsetHeight: number) => {

        const image = imageRef.current!;
        image.style.width = `${sizeRef.current!.width + offsetWidth}px`;
        image.style.height = `${sizeRef.current!.height + offsetHeight}px`;
    }, []);

    const handleEnd = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey!)! as ImageNode;
            const image = imageRef.current!;
            node.setWidth(image.width);
            node.setHeight(image.height);
        })
        sizeRef.current = undefined;
    }, [editor, nodeKey]);

    const handleClick = useCallback((e: MouseEvent) => {
        if(e.target === imageRef.current){
            setSelected(!isSelected);
        }
        
        return false;
    }, [isSelected, setSelected]);

    const handleEdit = useCallback(() => {
        editor.dispatchCommand(OPEN_CANVAS, {image: imageRef.current!, key: nodeKey!});
    }, [editor, nodeKey]);

    useEffect(() => {
        return editor.registerCommand(CLICK_COMMAND, handleClick, 1);
    }, [editor, handleClick]);

    return <Resizer onResize={handleResize} onResizeStart={handleStart} onResizeEnd={handleEnd} showHandle={isSelected}>
        <img src={src} alt={alt}
            style={{
                height: height,
                width: width,
                maxWidth: MAX ? MAX / 2 : undefined,
                minWidth: MAX ? MAX / 4 : undefined,
            }}
            ref={imageRef} />
        <Button className={styles.imageEdit} onClick={handleEdit} style={{visibility: isSelected ? "visible" : "hidden"}} icon={<RiEdit2Fill size={20}/>}/>
    </Resizer>;
}

export default ImageView;