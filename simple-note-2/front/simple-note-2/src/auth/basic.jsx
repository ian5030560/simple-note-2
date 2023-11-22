import React, { useState, useEffect } from "react";
import { Button, Flex, Form, Space, Typography, Result, Modal } from "antd";
const { Title, Link } = Typography;
/**
 * 
 * @param {string} url 
 * @param {any} data 
 * @param {(response: Response) => void} onReceive 
 * @param {(error) => void} onError 
 */
function postData(url, data, onReceive, onError) {
    fetch(url, {
        body: data,
        method: "POST",
        mode: "no-cors",
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "content-type": "application/json",
        },
    })
        .then(res => {
            onReceive(res);
        })
        .catch(e => {
            onError(e);
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
    onSuccess: (res) => { }
}

// eslint-disable-next-line no-unused-vars
const failureType = {
    title: "",
    subtitle: "",
    /**
     * 
     * @param {Error} e
     */
    onFailure: (e) => { }
}

const AuthModal = ({
    successTitle,
    successOpen,
    successSubtitle,
    onSuccess,
    failureTitle,
    failureOpen,
    failureSubtitle,
    onFailure
}) => {
    return <>
        <Modal
            title={successTitle}
            open={successOpen}
            closeIcon={null}
            footer={[
                <Button type="primary" onClick={() => onSuccess()} key="s-ok">
                    ok
                </Button>
            ]}>
            <Result status="success" title={successTitle} subTitle={successSubtitle} />
        </Modal>
        <Modal
            title={failureTitle}
            open={failureOpen}
            closeIcon={null}
            footer={[
                <Button type="primary" onClick={() => {onFailure()}} key="f-ok">
                    ok
                </Button>
            ]}>
            <Result status="error" title={failureTitle} subTitle={failureSubtitle} />
        </Modal>
    </>
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
    onSubmit,
    success,
    failure,
    url,
}) => {

    const [submittable, setSubmittable] = React.useState(false);
    const [state, setState] = useState();
    const values = Form.useWatch([], form);

    useEffect(() => {
        form.validateFields({
            validateOnly: true,
        })
            .then(
                () => {
                    setSubmittable(true);
                },
                () => {
                    setSubmittable(false);
                },
            );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    const validateMessages = {
        // eslint-disable-next-line no-template-curly-in-string
        required: 'Please enter the ${label}',
        types: {
            // eslint-disable-next-line no-template-curly-in-string
            email: '${label} is not correct',
        },
        number: {
            // eslint-disable-next-line no-template-curly-in-string
            range: "${label} must be between ${min} and ${max}"
        }
    };

    const {
        title: successTitle,
        subtitle: successSubtitle,
        onSuccess
    } = success;

    const {
        title: failTitle,
        subtitle: failSubtitle,
        onFailure
    } = failure;

    const handleClick = () => {
        setState("loading");
        postData(
            url,
            onSubmit(),
            (res) => {
                setState("success");
                console.log(res);
                // onSuccess(res);
            },
            (e) => {
                setState("failure");
                console.log(e);
                // onFailure(e);
            })
    }

    return <>
        <Form
            form={form}
            size="large"
            validateMessages={validateMessages}
            labelWrap
            style={{ width: "40%" }}
            autoComplete="on"
        >
            <Title>
                {title}
            </Title>
            {children}
            <Form.Item>
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
                            onClick={() => { form.resetFields() }}
                        >
                            clear
                        </Button>
                    </Space>
                    <Link onClick={() => { onChange?.() }}>{changeText}</Link>
                </Flex>
            </Form.Item>
        </Form>
        <AuthModal
            successTitle={successTitle}
            successSubtitle={successSubtitle}
            successOpen={state === "success"}
            onSuccess={() => {setState(); onSuccess();}}
            failureTitle={failTitle}
            failSubtitle={failSubtitle}
            failureOpen={state === "failure"}
            onFailure={() => {setState(); onFailure();}}
        />
    </>
}

export default AuthForm;