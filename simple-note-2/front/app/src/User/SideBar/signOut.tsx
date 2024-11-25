import { Modal, notification, Typography } from "antd";
import useUser from "../../util/useUser";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface SignOutModalProps {
    open: boolean;
    onClose: () => void;
}
export default function SignOutModal(props: SignOutModalProps) {

    const { signOut: _signOut } = useUser();
    const [api, contextholder] = notification.useNotification();
    const navigate = useNavigate();

    const handleOk = useCallback(() => {
        props.onClose();
        _signOut().then(res => {
            if(res !== undefined) throw new Error();
            return navigate("/");
        }).catch(() => {
            api.error({ message: "登出發生錯誤，請重新登出", placement: "top" });
        });

    }, [_signOut, api, navigate, props]);

    return <Modal open={props.open} centered title="登出" okText="是" cancelText="否"
        okButtonProps={{ danger: true, }} cancelButtonProps={{ type: "default" }}
        onOk={handleOk} onCancel={props.onClose}>
        <Typography.Text>是否確定登出</Typography.Text>
        {contextholder}
    </Modal>
}