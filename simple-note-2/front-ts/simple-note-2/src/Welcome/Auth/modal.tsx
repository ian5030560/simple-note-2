import React, { useState } from "react";
import { Button, Form, Result, Modal, Input, notification } from "antd";
import postData from "../../util/post";

interface ForgetProp {
  open: boolean,
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export const ForgetPwdModal: React.FC<ForgetProp> = ({ open, onCancel }) => {
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const handleFinished = (values) => {

    setLoading(true);
    postData("http://localhost:8000/forget_password/", values)
      .then((res) => {
        setLoading(false);
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
        setLoading(false);
        api.error({
          message: "密碼傳送失敗，請重新提交",
          placement: "top",
        });
      });
  };

  return (
    <>
      <Modal title="尋找密碼" open={open} footer={[]} onCancel={onCancel}>
        <Form onFinish={handleFinished}>
          <Form.Item
            name={"username"}
            rules={[
              {
                required: true,
                message: "Please enter an username",
              },
            ]}
          >
            <Input type="text" placeholder="輸入你的username" />
          </Form.Item>
          <Form.Item
            name={"email"}
            rules={[
              {
                required: true,
                message: "Please enter an email address",
              },
              {
                type: "email",
                message: "email address is not available",
              },
            ]}
          >
            <Input type="email" name="email" placeholder="輸入你的email" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ minWidth: "100%" }}
              loading={loading}
            >
              submit
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
