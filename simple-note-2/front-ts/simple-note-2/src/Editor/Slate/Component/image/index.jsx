import React, { useRef, useCallback } from "react";
import { useSlate } from "slate-react";
import { Image as AntImage, Button } from "antd";
import ImageHelper from "./helper";
import User from "../../../../service/user";

const Image = ({ element, children }) => {

    const ref = useRef();
    const editor = useSlate();

    const handleChange = useCallback(async (e) => {
        let src = await User.uploadImage(e.target.files[0]);
        ImageHelper.setSource(editor, src, element);
    }, [editor, element]);

    return <span
        style={{width: "100%"}}
    >   
        <div
            style={{
                textAlign: element.align ? element.align : "start",
            }}
        >
            {element.src ?
                <AntImage src={element.src} contentEditable={false} width={300} preview={false} /> :
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