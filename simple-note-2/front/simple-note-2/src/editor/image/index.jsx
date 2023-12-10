import React, {useRef, useState} from "react";
import { useSlate } from "slate-react";

const ImageElement = ({ attributes, element, children }) => {

    const ref = useRef();
    const [src, setSrc] = useState(element.src);
    const editor = useSlate();

    const handleChange = (e) => {
        setSrc(URL.createObjectURL(e.target.files[0]));
        
    } 

    return <>
        {src ?
            <img src={src} alt="" />:
            <button onClick={(e) => {e.stopPropagation(); ref.current.click();}}>upload</button>
        }
        <input ref={ref} type="file" accept="image/*" style={{display: "none"}} onChange={handleChange}/>
        {children}
    </>
}

export default ImageElement;