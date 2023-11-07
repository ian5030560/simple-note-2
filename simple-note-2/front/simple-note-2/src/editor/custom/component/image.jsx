import React, { useState } from "react";
import { Button, Image as ImageView } from "antd";
import { FileAddOutlined } from "@ant-design/icons";

const ImageDialog = ({ src = "", onSelect }) => {

    const [value, setValue] = useState(src);

    const handleClick = () => {
        const dialog = document.createElement("input");
        dialog.type = "file";
        dialog.accept = "image/*";

        dialog.onchange = () => {
            const file = dialog.files[0];
            setValue(URL.createObjectURL(file));
            onSelect(file);
        }

        dialog.click();
    }

    return <>
        {(value && value.length !== 0) ? <ImageView src = {value} preview={false}/>
        :<Button type="primary" onClick={handleClick} style={{ width: "100%" }}><FileAddOutlined />Add an image</Button>}
    </>
}

export default ImageDialog;