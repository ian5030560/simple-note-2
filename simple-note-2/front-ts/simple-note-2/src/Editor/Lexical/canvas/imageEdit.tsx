import React from "react";
import { createPortal } from "react-dom";
import styles from "./imageEdit.module.css";
import { RiEdit2Fill } from "react-icons/ri";

interface ImageEditProp extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
    top: number;
    left: number;
}
const ImageEdit = ({top, left, ...prop}: ImageEditProp) => {
    return createPortal(
        <button className={styles.imageEdit} {...prop} 
            style={{top: top, left: left}}><RiEdit2Fill size={30}/></button>,
        document.body
    )
}

export default ImageEdit;