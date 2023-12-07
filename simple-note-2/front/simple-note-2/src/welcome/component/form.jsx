import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Form,
  Space,
  Typography,
} from "antd";
import postData from "../../util/post";
import { AuthModal, ForgetPwdModal } from "./modal";
const { Title, Link } = Typography;

const STATE = {
  SUCCESS: "success",
  FAILURE: "failure",
  LOADING: "loading",
  FORGET: "forget",
}

// eslint-disable-next-line no-unused-vars
const successType = {
  title: "",
  subtitle: "",
  onSuccessClose: () => { },
  /**
   * 
   * @param {Response} res 
   */
  onSuccess: (res) => { },
}

// eslint-disable-next-line no-unused-vars
const failureType = {
  title: "",
  subtitle: "",
  onFailureClose: () => { },
  /**
   * 
   * @param {Error | Response} res 
   */
  onFailure: (res) => { }
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
  switchText,
  onSwitch,
  success,
  failure,
  url,
  id,
}) => {
  const [submittable, setSubmittable] = useState(false);
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

  const { title: successTitle, subtitle: successSubtitle, onSuccess, onSuccessClose } = success;

  const { title: failureTitle, subtitle: failureSubtitle, onFailure, onFailureClose } = failure;

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

        if (res.status === 200 || res.status === 201) {
          onSuccess?.(res);
          console.log(res);
          setState(STATE.SUCCESS);
        }
        else {
          onFailure?.(res);
          setState(STATE.FAILURE);
        }
      })
      .catch(e => {
        onFailure?.(e);
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
                  onSwitch?.();
                }}
              >
                {switchText}
              </Link>
              <Link onClick={() => setState(STATE.FORGET)}>忘記密碼</Link>
            </Space>
          </Flex>
        </Form.Item>
      </Form>
      <AuthModal
        success={{
          title: successTitle,
          subtitle: successSubtitle,
          open: state === STATE.SUCCESS,
          onSuccessClose: () => {
            setState();
            onSuccessClose?.();
          }
        }}

        failure={{
          title: failureTitle,
          subtitle: failureSubtitle,
          open: state === STATE.FAILURE,
          onFailureClose: () => {
            setState();
            onFailureClose?.();
          }
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
