import { Plugin } from "../index";
import { LexicalCommand, createCommand } from "lexical";
import CanvasModal, { CanvasData } from "./modal";
import { useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";

export const OPEN_CANVAS: LexicalCommand<CanvasData | null> = createCommand();
const CanvasPlugin: Plugin = () => {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();
    const dataRef = useRef<CanvasData | null>(null);

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(OPEN_CANVAS, (payload) => {
                setOpen(true);
                dataRef.current = payload;
                return false;
            }, 4)
        )
    }, [editor]);

    return <CanvasModal open={open}
        onClose={() => {
            dataRef.current = null;
            setOpen(false);
        }}
        data={dataRef.current} />
}

export default CanvasPlugin;