import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Form,
  Space,
  Typography,
  Result,
  Modal,
  Input,
  notification
} from "antd";
const { Title, Link } = Typography;

/**
 *
 * @param {string} url
 * @param {any} data
 * @param {(response: Response) => void} onReceive
 * @param {(error) => void} onError
 */
export function postData(url, data) {
  return fetch(url, {
    credentials: "include",
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "content-type": "application/json",
    },
  })
}

// eslint-disable-next-line no-unused-vars
const successType = {
  title: "",
  subtitle: "",
  /**
   *
   * @param {Response} res
   */
  onSuccess: (res) => { },
};

// eslint-disable-next-line no-unused-vars
const failureType = {
  title: "",
  subtitle: "",
  /**
   *
   * @param {Error} e
   */
  onFailure: (e) => { },
};

const ForgetPwdModal = ({ open, onCancel }) => {

  const [api, contextHolder] = notification.useNotification();

  const handleFinished = (values) => {

    postData(
      "http://localhost:8080/forgetpassword",
      values,
    )
      .then((res) => {
        if (res.status === 200) {
          api.success(
            {
              message: "已傳送密碼至您的email",
              placement: "top",
            }
          )
        }
        else {
          api.error(
            {
              message: "密碼傳送失敗，請重新提交",
              placement: "top"
            }
          )
        }
      })
      .catch(() => {
        api.error(
          {
            message: "密碼傳送失敗，請重新提交",
            placement: "top"
          }
        )
      });
  }

  return <>
    <Modal title="尋找密碼" open={open} footer={[]} onCancel={onCancel}>
      <Form onFinish={handleFinished}>
        <Form.Item
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
          <Input type="email" placeholder="輸入你的email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ minWidth: "100%" }}>
            submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    {contextHolder}
  </>
};

const AuthModal = ({
  successTitle,
  successOpen,
  successSubtitle,
  onSuccess,
  failureTitle,
  failureOpen,
  failureSubtitle,
  onFailure,
}) => {
  return (
    <>
      <Modal
        title={successTitle}
        open={successOpen}
        closeIcon={null}
        footer={[
          <Button type="primary" onClick={() => onSuccess()} key="s-ok">
            ok
          </Button>,
        ]}
      >
        <Result
          status="success"
          title={successTitle}
          subTitle={successSubtitle}
        />
      </Modal>
      <Modal
        title={failureTitle}
        open={failureOpen}
        closeIcon={null}
        footer={[
          <Button
            type="primary"
            onClick={() => {
              onFailure();
            }}
            key="f-ok"
          >
            ok
          </Button>,
        ]}
      >
        <Result
          status="error"
          title={failureTitle}
          subTitle={failureSubtitle}
        />
      </Modal>
    </>
  );
};

const STATE = {
  SUCCESS: "success",
  FAILURE: "failure",
  LOADING: "loading",
  FORGET: "forget",
}

/**
 *
 * @param {{success: successType, failure: failureType}} param0
 * @returns
 */
const AuthForm = ({
  form,
  title,
  children,
  changeText,
  onChange,
  success,
  failure,
  url,
  id,
}) => {
  const [submittable, setSubmittable] = React.useState(false);
  const [state, setState] = useState();
  const [failCause, setFailCause] = useState();
  const values = Form.useWatch([], form);

  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const { title: successTitle, subtitle: successSubtitle, onSuccess } = success;

  const { title: failTitle, subtitle: failSubtitle, onFailure } = failure;

  const handleFinished = (values) => {

    setState(STATE.LOADING);

    values = {
      ...values,
      id: id,
    };

    postData(
      url,
      values,
    )
      .then(res => {

        setFailCause(() => {

          if (res.status === 200 || res.status === 201) return "";

          switch (res.status) {
            case 401:
              return "username 重複";
            case 402:
              return "email 重複";
            case 400:
              return failSubtitle;
            default:
              console.log(res.status);
              return "發生重大錯誤，請重新提交";
          }
        })

        setState(res.status === 200 || res.status === 201 ? STATE.SUCCESS : STATE.FAILURE);
      })
      .catch(e => {
        setState(STATE.FAILURE);
        console.log(e.name);
        console.log(e.message);
      });
  };

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: "Please enter the ${label}",
    types: {
      // eslint-disable-next-line no-template-curly-in-string
      email: "${label} is not correct",
    },
    number: {
      // eslint-disable-next-line no-template-curly-in-string
      range: "${label} must be between ${min} and ${max}",
    },
  };

  return (
    <>
      <Form
        form={form}
        size="large"
        validateMessages={validateMessages}
        labelWrap
        labelCol={{
          span: 4,
        }}
        style={{ width: "40%" }}
        autoComplete="on"
        onFinish={handleFinished}
      >
        <Title>{title}</Title>
        {children}
        <Form.Item
          wrapperCol={{
            offset: 4,
          }}
        >
          <Flex justify="space-between">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!submittable}
                loading={state === STATE.SUCCESS}
              >
                submit
              </Button>
              <Button type="primary" htmlType="reset">
                clear
              </Button>
            </Space>
            <Space>
              <Link
                onClick={() => {
                  onChange?.();
                }}
              >
                {changeText}
              </Link>
              <Link onClick={() => setState(STATE.FORGET)}>忘記密碼</Link>
            </Space>
          </Flex>
        </Form.Item>
      </Form>
      <AuthModal
        successTitle={successTitle}
        successSubtitle={successSubtitle}
        successOpen={state === STATE.SUCCESS}
        onSuccess={() => {
          setState();
          onSuccess();
        }}
        failureTitle={failTitle}
        failureSubtitle={failCause}
        failureOpen={state === STATE.FAILURE}
        onFailure={() => {
          setState();
          onFailure();
        }}
      />
      <ForgetPwdModal
        open={state === STATE.FORGET}
        onCancel={() => {
          setState();
        }}
      />
    </>
  );
};

export default AuthForm;
