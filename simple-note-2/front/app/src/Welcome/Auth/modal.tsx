import React, { useState } from "react";
import { Button, Form, Result, Modal, Input, notification } from "antd";
import useAPI from "../../util/api";

type ForgetPwdData = {
  username: string;
  email: string;
  password: string;
}
interface ForgetPwdModalProps {
  open: boolean;
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export const ForgetPwdModal = ({ open, onCancel }: ForgetPwdModalProps) => {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { auth: { forgetPassword } } = useAPI();

  const handleFinished = (values: ForgetPwdData) => {
    setLoading(true);

    const { username, email } = values;
    forgetPassword(username, email).then(ok => {
      if (!ok) {
        throw new Error();
      } else {
        api.success({
          message: "已傳送密碼至您的信箱",
          placement: "top",
        });
      }
    }).catch(() => {
      api.error({
        message: "密碼傳送失敗，請重新提交",
        placement: "top",
      });
    }).finally(() => setLoading(false));
  };

  return <>
    <Modal title="尋找密碼" open={open} footer={null} onCancel={onCancel}>
      <Form onFinish={handleFinished}>
        <Form.Item name={"username"} rules={[{ required: true, message: "輸入你的帳號" }]}>
          <Input type="text" placeholder="輸入你的帳號" />
        </Form.Item>
        <Form.Item name={"email"}
          rules={[
            { required: true, message: "輸入你的信箱" },
            { type: "email", message: "輸入的信箱不正確" },
          ]}
        >
          <Input type="email" name="email" placeholder="輸入你的信箱" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ minWidth: "100%" }} loading={loading}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    {contextHolder}
  </>;
};

interface ResultModalProps {
  title: string;
  subtitle: string;
  open: boolean;
  onClose: () => void;
}

interface AuthProp {
  success: ResultModalProps;
  failure: ResultModalProps;
}

export const AuthModal: React.FC<AuthProp> = ({ success, failure }) => {
  return <>
    <Modal title={success.title} open={success.open} closeIcon={null}
      footer={<Button type="primary" onClick={() => success.onClose()}>確定</Button>}>
      <Result status="success" title={success.title} subTitle={success.subtitle} />
    </Modal>
    <Modal title={failure.title} open={failure.open} closeIcon={null}
      footer={<Button type="primary" onClick={() => failure.onClose()}>確定</Button>}>
      <Result status="error" title={failure.title} subTitle={failure.subtitle} />
    </Modal>
  </>
};
