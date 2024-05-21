import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand, LexicalCommand } from "lexical";
import Modal, { ModalRef } from "./../../UI/modal";
import { Excalidraw } from "@excalidraw/excalidraw";
import { AppState, BinaryFiles, ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";

export const OPEN_CANVAS: LexicalCommand<ExcalidrawInitialDataState | null> = createCommand();
const CanvasModal = () => {
    const ref = useRef<ModalRef>(null);
    const [api, apiCallback] = useState<ExcalidrawImperativeAPI>();
    const [state, setState] = useState<ExcalidrawInitialDataState | null>();
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.registerCommand(OPEN_CANVAS, payload => {
            setState(payload);
            return false;
        }, 4);
    })

    const handleChange = useCallback((elements: ExcalidrawInitialDataState["elements"], appState: AppState, files: BinaryFiles) => {
        setState(prev => ({
            appState: appState,
            elements: elements,
            files: files,
            ...prev,
        }))
    }, []);

    return <Modal command={OPEN_CANVAS} ref={ref} title="繪畫" styles={{body: {height: 400}}} width={800}>
        <Excalidraw excalidrawAPI={apiCallback} initialData={state} onChange={handleChange}/>
    </Modal>
}

export default CanvasModal;