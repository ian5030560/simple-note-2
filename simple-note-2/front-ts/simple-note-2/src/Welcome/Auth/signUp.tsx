import React, { useState, useEffect } from "react";
import { Flex, Form, Input, Typography, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "./modal";
import { useCookies } from "react-cookie";
import { AuthProp, STATE, validateMessages } from "./constant";
import useAPI, {APIs} from "../../util/api";

const { Title } = Typography;

type SignUpProp = AuthProp
const SignUp: React.FC<SignUpProp> = ({ onChange }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [cause, setCause] = useState("");
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [state, setState] = useState<STATE | null>();
    const values = Form.useWatch([], form);
    const signUp = useAPI(APIs.signUp);

    useEffect(() => {
        form.validateFields({
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
            id: "register",
        };

        signUp(values)
            .then(res => {
                setState(res.status === 200 || res.status === 201 ? STATE.SUCCESS : STATE.FAILURE);
                setCause(() => {
                    switch (res.status) {
                        case 401:
                            return "username 重複";
                        case 402:
                            return "email 重複";
                        case 400:
                            return "註冊錯誤，請重新輸入";
                        default:
                            return "發生重大錯誤，請重新提交";
                    }
                })
            })
            .catch(() => {
                setCause(() => "發生重大錯誤，請重新提交");
                setState(STATE.FAILURE);
            });
    };

    return <>
        <Form
            form={form} size="large" validateMessages={validateMessages}
            labelWrap style={{ width: "40%" }}
            autoComplete="on" onFinish={handleFinished}
        >
            <Title>註冊</Title>
            <Form.Item
                label="帳號"
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
                label="信箱"
                name="email"
                rules={[
                    {
                        type: "email",
                        required: true,
                    },
                ]}
            >
                <Input type="email" />
            </Form.Item>
            <Form.Item
                label="密碼"
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
                    offset: 2,
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
                            提交
                        </Button>
                        <Button type="primary" htmlType="reset">
                            清除
                        </Button>
                    </Space>
                    <Space>
                        <Button
                            type="link"
                            onClick={() => onChange?.()}
                        >
                            登入
                        </Button>
                    </Space>
                </Flex>
            </Form.Item>
        </Form>
        <AuthModal
            success={{
                title: "註冊成功",
                subtitle: "註冊成功請返回首頁登入",
                open: state === STATE.SUCCESS,
                onSuccessClose: () => {
                    setState(() => null);
                    navigate(0);
                }
            }}

            failure={{
                title: "註冊失敗",
                subtitle: cause,
                open: state === STATE.FAILURE,
                onFailureClose: () => setState(() => null)
            }}
        />
    </>
};

export default SignUp;