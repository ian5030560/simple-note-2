import React, {useRef, useState} from "react";
import DefaultElement from "./default";
import { withReact } from "slate-react";
import { createEditor } from "slate";

const ImageElement = ({ attributes, element, children }) => {

    const ref = useRef();
    const [src, setSrc] = useState(element.src);
    const [editor] = useState(() => withReact(createEditor()));

    const handleChange = (e) => {
        setSrc(URL.createObjectURL(e.target.files[0]));
        
    } 

    return <DefaultElement attributes={attributes}>
        {src ?
            <img src={src} alt="" />:
            <button onClick={(e) => {e.stopPropagation(); ref.current.click();}}>upload</button>
        }
        <input ref={ref} type="file" accept="image/*" style={{display: "none"}} onChange={handleChange}/>
        {children}
    </DefaultElement>
}

export default ImageElement;