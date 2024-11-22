import { Modal, notification, Typography } from "antd";
import useUser from "./useUser";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAPI from "../../util/api";

interface SignOutModalProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}
export default function SignOutModal(props: SignOutModalProps) {

    const { username, signOut: userSignOut } = useUser();
    const [api, contextholder] = notification.useNotification();
    const navigate = useNavigate();
    const { auth: { signOut } } = useAPI();

    const handleOk = useCallback(() => {
        props.onOk();
        signOut(username).then((res) => {
            if (!res) {
                throw new Error();
            }
            else {
                userSignOut();
                navigate("/");
            }
        }).catch(() => {
            api.error({ message: "登出發生錯誤，請重新登出", placement: "top" });
        });

    }, [api, navigate, props, signOut, userSignOut, username]);

    return <Modal open={props.open} centered title="登出" okText="是" cancelText="否"
        okButtonProps={{ danger: true, }} cancelButtonProps={{ type: "default" }}
        onOk={handleOk} onCancel={() => props.onCancel}>
        <Typography.Text>是否確定登出</Typography.Text>
        {contextholder}
    </Modal>
}