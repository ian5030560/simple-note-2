import { Plugin } from "../Interface";
import { LexicalCommand, createCommand } from "lexical";
import CanvasModal from "./modal";
import { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const OPEN_CANVAS: LexicalCommand<CanvasImageSource | null> = createCommand();
const CanvasPlugin: Plugin = () => {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const imageRef = useRef<CanvasImageSource | null>(null);

    useEffect(() => {
        return editor.registerCommand(OPEN_CANVAS, (payload) => {
            setOpen(true);
            imageRef.current = payload;
            return false;
        }, 4);
    }, [editor]);

    return <CanvasModal open={open} onClose={() => setOpen(false)} image={imageRef.current}/>;
}

export default CanvasPlugin;