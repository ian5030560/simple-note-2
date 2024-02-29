import { Modal, Flex } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { IoIosSave, IoIosRedo, IoIosUndo } from "react-icons/io";
import styles from "./modal.module.css";
import useStep from "./step";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_IMAGE } from "../../image";
import { CanvasToolBar } from "./tool";

const DEFAULT = { width: 800, height: 500 };
const ERASER = "eraser";
interface CanvasModalProp {
    open: boolean;
    image: CanvasImageSource | null;
    onClose?: () => void;
}
const CanvasModal: React.FC<CanvasModalProp> = (prop) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const startRef = useRef({ x: 0, y: 0 });
    const [size, setSize] = useState<number>();
    const step = useStep(canvasRef.current);
    const [editor] = useLexicalComposerContext();

    const handleOpenChange = useCallback((open: boolean) => {
        if (open) {
            let canvas = canvasRef.current!;
            canvas.width = DEFAULT.width;
            canvas.height = DEFAULT.height;
            canvas.style.width = `${DEFAULT.width}px`;
            canvas.style.height = `${DEFAULT.height}px`;
            contextRef.current = canvas.getContext("2d");
        }
    }, []);

    const handlePointerEnter = useCallback(() => {
        let context = contextRef.current!;
        if (!color || !context) return;

        if (color === ERASER) {
            context.globalCompositeOperation = "destination-out";
        }
        else {
            context.strokeStyle = color;
        }

        if (size) context.lineWidth = size;
    }, [color, size]);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        let context = contextRef.current!;
        let canvas = canvasRef.current;
        if (!color || !context || !canvas) return;

        let { top, left } = canvas.getBoundingClientRect();

        context.moveTo(startRef.current.x, startRef.current.y);
        context.lineTo(e.clientX - left, e.clientY - top);
        context.stroke();

        startRef.current = { x: e.clientX - left, y: e.clientY - top };
    }, [color]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        e.preventDefault();
        if (!canvasRef.current) return;
        let canvas = canvasRef.current;

        step?.save();
        contextRef.current?.beginPath();
        let { top, left } = canvas.getBoundingClientRect();
        startRef.current = { x: e.nativeEvent.clientX - left, y: e.nativeEvent.clientY - top };
        canvasRef.current?.addEventListener("pointermove", handlePointerMove);
    }, [handlePointerMove, step]);

    const handlePointerUp = useCallback(() => {
        contextRef.current?.closePath();
        canvasRef.current?.removeEventListener("pointermove", handlePointerMove);
    }, [handlePointerMove]);

    const handleExport = useCallback(() => {
        if (!step || !step.isDirty()) return;
        let image = step.export();
        editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: image.src });
    }, [editor, step]);

    const handleClose = useCallback(() => {
        if (step?.isDirty()) {
            let result = window.confirm("內容尚未儲存, 是否儲存");
            if (result) handleExport();
        }

        step?.clear();
        prop.onClose?.();

    }, [handleExport, prop, step]);

    return <Modal onCancel={handleClose} open={prop.open} footer={null} centered width={900} afterOpenChange={handleOpenChange}>
        <Flex justify="center" align="center" vertical>
            <Flex justify="center" vertical>
                <Flex justify="end" align="center" style={{ marginBottom: 5 }}>
                    <button className={styles["access-button"]}
                        onClick={() => {
                            contextRef.current!.globalCompositeOperation = "source-over";
                            step?.undo();
                        }}><IoIosUndo size={30} /></button>
                    <button className={styles["access-button"]}
                        onClick={() => {
                            contextRef.current!.globalCompositeOperation = "source-over";
                            step?.redo();
                        }}><IoIosRedo size={30} /></button>
                    <button className={styles["access-button"]} onClick={handleExport}><IoIosSave size={30} /></button>
                </Flex>
                <canvas ref={canvasRef} style={{ backgroundColor: "whitesmoke" }}
                    onPointerDown={handlePointerDown}
                    onPointerEnter={handlePointerEnter}
                    onPointerUp={handlePointerUp}
                />
                <CanvasToolBar
                    recommendColors={["red", "blue", "green", "yellow"]}
                    onPickColor={setColor}
                    onEraseClick={() => setColor(ERASER)}
                    onSizeChange={setSize}
                    onOtherColorChange={setColor}
                />
            </Flex>
        </Flex>

    </Modal>;
}

export default CanvasModal;