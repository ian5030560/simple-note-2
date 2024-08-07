import React, { useState } from "react";
import { Button, Form, Result, Modal, Input, notification } from "antd";
import useAPI, { APIs } from "../../util/api";

interface ForgetProp {
  open: boolean,
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const ForgetPwdModal: React.FC<ForgetProp> = ({ open, onCancel }) => {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const forgetPassword = useAPI(APIs.forgetPassword);

  const handleFinished = (values: any) => {
    setLoading(true);

    forgetPassword(values)[0]
      .then((res) => {
        if (res.status === 200) {
          api.success({
            message: "已傳送密碼至您的email",
            placement: "top",
          });
        } else {
          api.error({
            message: "密碼傳送失敗，請重新提交",
            placement: "top",
          });
        }
      })
      .catch(() => {
        api.error({
          message: "密碼傳送失敗，請重新提交",
          placement: "top",
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal title="尋找密碼" open={open} footer={null} onCancel={onCancel}>
        <Form onFinish={handleFinished}>
          <Form.Item
            name={"username"}
            rules={[
              {
                required: true,
                message: "輸入你的帳號",
              },
            ]}
          >
            <Input type="text" placeholder="輸入你的帳號" />
          </Form.Item>
          <Form.Item
            name={"email"}
            rules={[
              {
                required: true,
                message: "輸入你的信箱",
              },
              {
                type: "email",
                message: "輸入的信箱不正確",
              },
            ]}
          >
            <Input type="email" name="email" placeholder="輸入你的email" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ minWidth: "100%" }} loading={loading}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {contextHolder}
    </>
  );
};

interface ResultType {
  title: string,
  subtitle: string,
  open: boolean,
}

interface SuccessType extends ResultType {
  onSuccessClose: () => void,
};

interface FailureType extends ResultType {
  onFailureClose: () => void,
};

interface AuthProp {
  success: SuccessType,
  failure: FailureType
}

export const AuthModal: React.FC<AuthProp> = ({ success, failure }) => {
  return <>
    <Modal
      title={success.title}
      open={success.open}
      closeIcon={null}
      footer={[
        <Button
          type="primary"
          onClick={() => success.onSuccessClose()}
          key="s-ok"
        >
          ok
        </Button>,
      ]}
    >
      <Result
        status="success"
        title={success.title}
        subTitle={success.subtitle}
      />
    </Modal>
    <Modal
      title={failure.title}
      open={failure.open}
      closeIcon={null}
      footer={[
        <Button
          type="primary"
          onClick={() => failure.onFailureClose()}
          key="f-ok"
        >
          ok
        </Button>,
      ]}
    >
      <Result
        status="error"
        title={failure.title}
        subTitle={failure.subtitle}
      />
    </Modal>
  </>
};
