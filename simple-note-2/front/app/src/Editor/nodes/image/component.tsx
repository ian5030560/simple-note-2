import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ImageNode, { ImageNodeProp } from ".";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey, CLICK_COMMAND } from "lexical";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import Resizer from "../../ui/resizer";

type ImageProp = ImageNodeProp;
const ImageView: React.FC<ImageProp> = ({ src, alt, height, width, nodeKey }) => {
    const [editor] = useLexicalComposerContext();

    const imageRef = useRef<HTMLImageElement>(null);
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey!);

    const MAX = useMemo(() => editor.getRootElement()?.getBoundingClientRect().width, [editor]);

    const handleResize = useCallback((width: number, height: number) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey!)! as ImageNode;
            node.setWidth(width);
            node.setHeight(height);
        })
    }, [editor, nodeKey]);

    const handleClick = useCallback((e: MouseEvent) => {
        if(imageRef.current?.contains(e.target as HTMLElement)){
            setSelected(!isSelected);
        }
        return false;
    }, [isSelected, setSelected]);

    useEffect(() => {
        return editor.registerCommand(CLICK_COMMAND, handleClick, 1);
    }, [editor, handleClick]);

    return <Resizer onResize={handleResize} showHandle={isSelected}>
        <img src={src} alt={alt} ref={imageRef}
            style={{
                height: height,
                width: width,
                maxWidth: MAX ? MAX / 2 : undefined,
                minWidth: MAX ? MAX / 4 : undefined,
            }} />
    </Resizer>;
}

export default ImageView;