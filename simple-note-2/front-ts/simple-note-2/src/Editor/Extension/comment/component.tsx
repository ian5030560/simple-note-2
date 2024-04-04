import { Button, Card, Space, theme } from "antd";
import styles from "./component.module.css";
import { FaRegWindowClose } from "react-icons/fa";
import { useState } from "react";

const Comment = () => {
    return <Card>

    </Card>;
}

export const CommentLane = () => {
    const { token } = theme.useToken();
    const [show, setShow] = useState(true);

    return <div className={show ? styles.commentLane : styles.commentLaneHide}
        style={{ backgroundColor: token.colorBgBase }}>
        <Button type="text" icon={<FaRegWindowClose />} onClick={() => setShow(false)}/>
        {/* <Space direction="vertical">

        </Space> */}
    </div>;
}