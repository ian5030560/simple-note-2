import React, { useState, useEffect } from "react";
import { Form, Input, Typography, Flex, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthModal, ForgetPwdModal } from "./modal";
import postData from "../../util/post";
import { STATE, validateMessages, AuthProp } from "./constant";

const { Title } = Typography;

type SignInProp = AuthProp
const SignIn: React.FC<SignInProp> = ({ onChange }) => {
    const [form] = Form.useForm();
    const [state, setState] = useState<STATE | null>();
    const navigate = useNavigate();
    const [submittable, setSubmittable] = useState(false);
    // const [, setCookie] = useCookies();
    const values = Form.useWatch([], form);

    useEffect(() => {
        form
            .validateFields({
                validateOnly: true,
            })
            .then(
                () => setSubmittable(true),
                () => setSubmittable(false)
            );
    }, [form, values]);

    const handleFinished = (values: any) => {

        setState(STATE.LOADING);

        values = {
            ...values,
            id: "login",
        };

        postData(
            "http://localhost:8000/signin/",
            values,
        )
            .then(res => setState(res.status === 200 || res.status === 201 ? STATE.SUCCESS : STATE.FAILURE))
            .catch(() => setState(STATE.FAILURE));
    };

    return <>
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
            <Title>登入</Title>
            <Form.Item
                label="username"
                name="username"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="password"
                name="password"
                rules={[
                    {
                        required: true,
                        min: 8,
                        max: 30,
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
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
                        <Button
                            type="link"
                            onClick={() => onChange?.()}
                        >
                            註冊
                        </Button>
                        <Button type="link" onClick={() => setState(STATE.FORGET)}>忘記密碼</Button>
                    </Space>
                </Flex>
            </Form.Item>
        </Form>
        <AuthModal
            success={{
                title: "登入成功",
                subtitle: "點擊確認跳轉至使用頁面",
                open: state === STATE.SUCCESS,
                onSuccessClose: () => {
                    setState(() => null);
                    navigate(0);
                }
            }}

            failure={{
                title: "登入失敗",
                subtitle: "帳號或密碼錯誤",
                open: state === STATE.FAILURE,
                onFailureClose: () => setState(() => null)
            }}
        />
        <ForgetPwdModal
            open={state === STATE.FORGET}
            onCancel={() => setState(() => null)}
        />
    </>

};


export default SignIn;