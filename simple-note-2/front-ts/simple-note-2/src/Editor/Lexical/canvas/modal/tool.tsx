import { Flex, ColorPicker } from "antd";
import React, { useCallback, useRef } from "react";
import {Color} from "antd/es/color-picker/color";
import styles from "./modal.module.css";
import { RxEraser } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";

interface ToolButtonProp extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
    backgroundColor: string;
}
const ToolButton = ({backgroundColor, ...buttonProp}: ToolButtonProp) => <button className={styles["tool-button"]} {...buttonProp} style={{backgroundColor: backgroundColor}}/>;

const EraseButton: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (prop) => <ToolButton {...prop} backgroundColor="white"><RxEraser size={20} /></ToolButton>;

interface AdditionButtonProp extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
    onColorChange: (value: Color, hex: string) => void
}
const AdditionButton = ({onColorChange, ...prop}: AdditionButtonProp) => {
    
    return <ColorPicker onChange={onColorChange}>
        <ToolButton {...prop} backgroundColor="white"><FaPlus size={20} /></ToolButton>
    </ColorPicker>
}

interface CanvasToolBarProp {
    recommendColors: string[],
    onPickColor: (color: string) => void,
    onEraseClick: (e: React.MouseEvent) => void,
    onSizeChange: (size: number) => void,
    onOtherColorChange: (color: string) => void,
}
export const CanvasToolBar: React.FC<CanvasToolBarProp> = (prop) => {

    const sizeRef = useRef<HTMLInputElement>(null);

    const handleChange = useCallback(() => {
        let value = parseInt(sizeRef.current!.value);
        prop.onSizeChange(value);
    }, [prop]);

    return <Flex justify="space-around" align="center">

        <Flex justify="center" align="center">
            <EraseButton onClick={prop.onEraseClick}/>
            {
                prop.recommendColors.map((color, index) => {
                    return <ToolButton backgroundColor={color} key={index} onClick={() => prop.onPickColor(color)} />
                })
            }
            <AdditionButton onColorChange={(_, hex) => prop.onOtherColorChange(hex)}/>
        </Flex>

        <Flex justify="center" align="center">
            <p>大小:</p>
            <p>{sizeRef.current ? sizeRef.current.value : 1}</p>
            <input type="range" min={0} max={100} defaultValue={1}
            className={styles["tool-slider"]} ref={sizeRef}
            onChange={handleChange}/>
        </Flex>
    </Flex>
}