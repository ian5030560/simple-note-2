import { Modal, Flex } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { RxEraser } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { IoIosSave, IoIosRedo, IoIosUndo } from "react-icons/io";
import styles from "./modal.module.css";

interface ToolButtonProp extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
    backgroundColor: string;
}
const ToolButton = ({backgroundColor, ...buttonProp}: ToolButtonProp) => <button className={styles["tool-button"]} {...buttonProp} style={{backgroundColor: backgroundColor}}/>;

const EraseButton: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (prop) => <ToolButton {...prop} backgroundColor="white"><RxEraser size={20} /></ToolButton>;
const AdditionButton: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (prop) => <ToolButton {...prop} backgroundColor="white"><FaPlus size={20} /></ToolButton>;

interface CanvasToolBarProp {
    recommendColors: string[];
    onPickColor: (color: string) => void;
}
const CanvasToolBar: React.FC<CanvasToolBarProp> = (prop) => {
    return <Flex justify="space-around" align="center">
        <Flex justify="center" align="center">
            <EraseButton />
            <p>大小:</p>
            <p>12</p>
            <input type="range" min={0} max={100} className={styles["tool-slider"]}/>
        </Flex>

        <Flex justify="center" align="center">
            {
                prop.recommendColors.map((color, index) => {
                    return <ToolButton backgroundColor={color} key={index} onClick={() => prop.onPickColor(color)} />
                })
            }
            <AdditionButton />
        </Flex>
    </Flex>
}


const DEFAULT = { width: 800, height: 500 };
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
        context.strokeStyle = color;
    }, [color]);

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
        let { top, left } = canvas.getBoundingClientRect();
        startRef.current = { x: e.nativeEvent.clientX - left, y: e.nativeEvent.clientY - top };

        let context = contextRef.current!;
        context.beginPath();
        canvasRef.current?.addEventListener("pointermove", handlePointerMove);
    }, [handlePointerMove]);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        canvasRef.current?.removeEventListener("pointermove", handlePointerMove);
    }, [handlePointerMove]);

    return <Modal onCancel={prop.onClose} open={prop.open} footer={null} centered width={900} afterOpenChange={handleOpenChange}>
        <Flex justify="center" align="center" vertical>
            <Flex justify="center" vertical>
                <Flex justify="end" align="center" style={{ marginBottom: 5 }}>
                    <button className={styles["access-button"]}><IoIosUndo size={30} /></button>
                    <button className={styles["access-button"]}><IoIosRedo size={30} /></button>
                    <button className={styles["access-button"]}><IoIosSave size={30} /></button>
                </Flex>
                <canvas ref={canvasRef} style={{ backgroundColor: "whitesmoke" }}
                    onPointerDown={handlePointerDown}
                    onPointerEnter={handlePointerEnter}
                    onPointerUp={handlePointerUp}
                />
                <CanvasToolBar
                    recommendColors={["red", "blue", "green", "yellow"]}
                    onPickColor={setColor}
                />
            </Flex>
        </Flex>

    </Modal>;
}

export default CanvasModal;