import { Modal, Input } from "antd";
import { useState, useCallback } from "react";
import useUser from "../../util/useUser";
import Form, { Rule } from "antd/es/form";

export type ChangePasswordData = {
    old: string;
    new: string;
    confirm: string;
}
interface ChangePasswordModalProps {
    open: boolean;
    onOk: (values: ChangePasswordData) => void;
    onClose: () => void;
}
export default function ChangePasswordModal(props: ChangePasswordModalProps){
    const [form] = Form.useForm<ChangePasswordData>();
    const [disabled, setDisabled] = useState(true);
    const { password } = useUser();

    const handleFinished = useCallback((values: ChangePasswordData) => {
        props.onClose();
        props.onOk(values);
    }, [props]);

    const invalidOldRule: Rule = useCallback(() => ({
        validateTrigger: ["onFinished"],
        validator: async (_: any, value: string) => {
            if (await password.compare(value)) return;
            throw new Error("舊密碼輸入錯誤");
        }
    }), [password]);

    const disabledConfirmRule: Rule = useCallback(() => ({
        validator: async (_: any, value: string) => Promise.resolve(setDisabled(value.length === 0))
    }), []);

    const matchNewRule: Rule = useCallback(({ getFieldValue }) => ({
        validator: (_: any, value: string) => {
            if (!value || getFieldValue("new") === value) return Promise.resolve();
            return Promise.reject(new Error("未符合新密碼"));
        }
    }), []);

    return <Modal title="更換密碼" open={props.open} destroyOnClose
        onCancel={props.onClose} okText="確認" okButtonProps={{ danger: true, htmlType: "submit" }}
        cancelText="取消" cancelButtonProps={{ htmlType: "reset" }}
        modalRender={(dom) => <Form form={form} autoComplete="off" name="password-form"
            onFinish={handleFinished} validateMessages={{ required: "${label} 尚未輸入" }}>{dom}</Form>}>
        <Form.Item name="old" label="舊密碼" rules={[{ required: true }, invalidOldRule]}>
            <Input.Password placeholder="輸入舊密碼" autoComplete="off" />
        </Form.Item>
        <Form.Item name="new" label="新密碼" rules={[{ required: true }, disabledConfirmRule]}>
            <Input.Password placeholder="輸入新密碼" autoComplete="off" />
        </Form.Item>
        <Form.Item name="confirm" label="確認密碼" dependencies={["new"]} rules={[{ required: true }, matchNewRule]}>
            <Input.Password placeholder="再次輸入新密碼" disabled={disabled} autoComplete="off" />
        </Form.Item>
    </Modal>
}