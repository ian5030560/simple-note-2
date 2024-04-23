import { Flex } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosSave, IoIosRedo, IoIosUndo } from "react-icons/io";
import styles from "./modal.module.css";
import useStep from "./step";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CanvasToolBar } from "./tool";
import { $isImageNode } from "../../image/node";
import { $getNodeByKey, createCommand, LexicalCommand } from "lexical";
import { INSERT_IMAGE } from "../../image/plugin";
import postData from "../../../../util/api";
import Modal, { ModalRef } from "./../../UI/modal";

export type CanvasData = {
    image: HTMLImageElement,
    key: string,
}
export const OPEN_CANVAS: LexicalCommand<CanvasData | null> = createCommand();
const ERASER = "eraser";
const CanvasModal = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [color, setColor] = useState<string | undefined>(undefined);
    const startRef = useRef({ x: 0, y: 0 });
    const [size, setSize] = useState<number>();
    const step = useStep(canvasRef.current);
    const [editor] = useLexicalComposerContext();
    const ref = useRef<ModalRef>(null);
    const [data, setData] = useState<CanvasData | null>(null);

    useEffect(() => {
        return editor.registerCommand(OPEN_CANVAS, payload => {
            if (payload) {
                setData(payload);
                let canvas = canvasRef.current;
                if (canvas) {
                    canvas.width = payload.image.width;
                    canvas.height = payload.image.height;
                    canvas.style.width = payload.image.width + "px";
                    canvas.style.height = payload.image.height + "px";
                }
            }
            return false;
        }, 4);
    }, [editor]);

    const handlePointerEnter = useCallback(() => {
        contextRef.current = canvasRef.current!.getContext("2d");
        if (!color || !contextRef.current) return;
        if (color === ERASER) {
            contextRef.current.globalCompositeOperation = "destination-out";
        }
        else {
            contextRef.current.strokeStyle = color;
        }

        if (size) contextRef.current.lineWidth = size;
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

        let blob = step.export();
        if (!blob) {
            let src = URL.createObjectURL(blob);
            editor.dispatchCommand(INSERT_IMAGE, { alt: "", src: src });
        }
        else {
            editor.update(() => {
                const node = $getNodeByKey(data!.key);
                if ($isImageNode(node)) {
                    // postData("http://localhost:8000/update_file/", {
                    //     username: "user",
                    //     content: data,
                    //     url: "http://localhost:8000/view_file/428220824_717405110214191_1896139774089273018_n.jpg"
                    // })
                    let src = URL.createObjectURL(blob);
                    node.setSrc(src);
                }
            })
        }
    }, [data, editor, step]);

    const handleClose = useCallback(() => {
        if (step?.isDirty()) {
            let result = window.confirm("內容尚未儲存, 是否儲存");
            if (result) handleExport();
        }
        step?.clear();
        setData(null);
    }, [handleExport, step]);

    return <Modal command={OPEN_CANVAS} ref={ref} footer={null} title="繪畫"
        width={data ? data.image.width + 50 : undefined} onClose={handleClose}>
        <Flex justify="center" align="center" vertical>
            <Flex justify="center" vertical>
                <Flex justify="end" align="center" style={{ marginBottom: 5 }}>
                    <button className={styles["access-button"]}
                        onClick={() => {
                            contextRef.current!.globalCompositeOperation = "source-over";
                            step?.undo();
                        }}><IoIosUndo size={30} />
                    </button>
                    <button className={styles["access-button"]}
                        onClick={() => {
                            contextRef.current!.globalCompositeOperation = "source-over";
                            step?.redo();
                        }}><IoIosRedo size={30} />
                    </button>
                    <button className={styles["access-button"]} onClick={handleExport}><IoIosSave size={30} /></button>
                </Flex>
                <canvas
                    ref={canvasRef} className={styles.canvas}
                    style={{ backgroundImage: data ? `url(${data.image.src})` : undefined }}
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
    </Modal>
}

export default CanvasModal;