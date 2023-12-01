import React, { useState } from "react";
import {
    Button,
    Form,
    Result,
    Modal,
    Input,
    notification
} from "antd";
import postData from "../../postMethod/post";

export const ForgetPwdModal = ({ open, onCancel }) => {

    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);

    const handleFinished = (values) => {
        setLoading(true);
        postData(
            "http://localhost:8000/forget_password/",
            values,
        )
            .then((res) => {
                setLoading(false);
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
                setLoading(false);
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
};

// eslint-disable-next-line no-unused-vars
const successType = {
    title: "",
    subtitle: "",
    open: false,
    onSuccessClose: () => { },
};

// eslint-disable-next-line no-unused-vars
const failureType = {
    title: "",
    subtitle: "",
    open: false,
    onFailureClose: () => { },
};

/**
 * 
 * @param {{success: successType, failure: failureType}} param0 
 * @returns 
 */
export const AuthModal = ({
    success,
    failure
}) => {
    return (
        <>
            <Modal
                title={success.title}
                open={success.open}
                closeIcon={null}
                footer={[
                    <Button
                        type="primary"
                        onClick={() => success.onSuccessClose()}
                        key="s-ok">
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
    );
};