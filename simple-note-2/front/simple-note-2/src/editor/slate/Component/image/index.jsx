import React, { useRef } from "react";
import { useSlate } from "slate-react";
import { Image as AntImage, Button } from "antd";
import ImageHelper from "./helper";

const Image = ({ element, children }) => {

    const ref = useRef();
    const editor = useSlate();

    const handleChange = (e) => {
        ImageHelper.setSource(editor, e.target.files[0], element);
    }

    return <span
        style={{width: "100%"}}
    >
        <div
            style={{
                textAlign: element.align ? element.align : "start",
            }}
        >
            {element.blob ?
                <AntImage src={URL.createObjectURL(element.blob)} contentEditable={false} width={300} preview={false} /> :
                <Button
                    type="primary"
                    style={{ width: "100%" }}
                    contentEditable={false}
                    onClick={(e) => { e.stopPropagation(); ref.current.click(); }}>
                    upload
                </Button>
            }
            <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleChange} />
            {children}
        </div>
    </span>
}

export default Image;