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
} from "antd";
import axios from "axios";
const { Title, Link } = Typography;

/**
 *
 * @param {string} url
 * @param {any} data
 * @param {(response: Response) => void} onReceive
 * @param {(error) => void} onError
 */
function postData(url, path, data, onReceive, onError) {

    let formdata = new FormData();
    
    for(let key in data){
        formdata.append(key, data[key]);
    }
    
    fetch(url + path, formdata,
        {
            url: url,
            mode: "cors",
            method: "POST",
            headers: {
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "content-type": "application/json",
            },
        }
    )
    .then((res) => onReceive(res))
    .catch((error) => onError(error))
}

// eslint-disable-next-line no-unused-vars
const successType = {
  title: "",
  subtitle: "",
  /**
   *
   * @param {Response} res
   */
  onSuccess: (res) => {},
};

// eslint-disable-next-line no-unused-vars
const failureType = {
  title: "",
  subtitle: "",
  /**
   *
   * @param {Error} e
   */
  onFailure: (e) => {},
};

const forgetPwdType = {};

const ForgetPwdModal = ({ open, onCancel }) => {
  return (
    <Modal title="尋找密碼" open={open} footer={[]} onCancel={onCancel}>
      <Form>
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
          <Button type="primary" htmlType="submit">
            submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
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
  onSubmit,
  success,
  failure,
  url,
  path,
}) => {
  const [submittable, setSubmittable] = React.useState(false);
  const [state, setState] = useState();
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

  const handleClick = () => {
    setState("loading");
    postData(
      url,
      path,
      onSubmit(),
      (res) => {
        setState("success");
        // onSuccess(res);
      },
      (e) => {
        setState("failure");
        console.log(e.name);
        console.log(1)
        // onFailure(e);
      }
    );
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
        wrapperCol={
          {
            // span: 16,
          }
        }
        style={{ width: "40%" }}
        autoComplete="on"
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
                onClick={handleClick}
                loading={state === "loading"}
              >
                submit
              </Button>
              <Button
                type="primary"
                htmlType="button"
                onClick={() => {
                  form.resetFields();
                }}
              >
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
              <Link>忘記密碼</Link>
            </Space>
          </Flex>
        </Form.Item>
      </Form>
      <AuthModal
        successTitle={successTitle}
        successSubtitle={successSubtitle}
        successOpen={state === "success"}
        onSuccess={() => {
          setState();
          onSuccess();
        }}
        failureTitle={failTitle}
        failSubtitle={failSubtitle}
        failureOpen={state === "failure"}
        onFailure={() => {
          setState();
          onFailure();
        }}
      />
      {/* <ForgetPwdModal open={} onCancel={}/> */}
    </>
  );
};

export default AuthForm;
