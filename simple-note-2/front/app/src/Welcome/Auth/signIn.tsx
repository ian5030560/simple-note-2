import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Typography, Flex, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthModal, ForgetPwdModal } from "./modal";
import { STATE, validateMessages, AuthProp } from "./constant";
import useAPI from "../../util/api";
import useUser from "../../User/SideBar/useUser";

const { Title } = Typography;

type SignInData = {
    username: string;
    password: string;
}
export default function SignIn({ onChange }: AuthProp) {
    const [form] = Form.useForm();
    const [state, setState] = useState<STATE | null>();
    const navigate = useNavigate();
    const [submittable, setSubmittable] = useState(false);
    const { signIn: _signIn } = useUser();
    const values = Form.useWatch([], form);
    const { auth: { signIn }, jwt: { getToken } } = useAPI();

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(
                () => setSubmittable(true),
                () => setSubmittable(false)
            );
    }, [form, values]);

    const handleFinished = useCallback(({ username, password }: SignInData) => {

        setState(STATE.LOADING);

        getToken(username, password).then(token => {
            signIn(username, password).then(ok => {
                if(!ok){
                    throw new Error();
                }
                else{
                    _signIn(username, token);
                    setState(STATE.SUCCESS);
                }
            });

        }).catch(() => setState(STATE.FAILURE));

    }, [_signIn, getToken, signIn]);

    return <>
        <Form form={form} size="large" validateMessages={validateMessages}
            labelWrap style={{ width: "40%" }} autoComplete="on" onFinish={handleFinished}>
            <Title>登入</Title>
            <Form.Item label="帳號" name="username" rules={[{ required: true }]}>
                <Input autoComplete="username" />
            </Form.Item>
            <Form.Item label="密碼" name="password" rules={[{ required: true, min: 8, max: 30, }]}>
                <Input.Password autoComplete="password" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2 }}>
                <Flex justify="space-between">
                    <Space>
                        <Button type="primary" htmlType="submit"
                            disabled={!submittable} loading={state === STATE.SUCCESS}>
                            提交
                        </Button>
                        <Button type="primary" htmlType="reset">清除</Button>
                    </Space>
                    <Space>
                        <Button type="link" onClick={() => onChange?.()}>註冊</Button>
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
                onClose: async () => {
                    setState(() => null);
                    navigate("note");
                }
            }}

            failure={{
                title: "登入失敗",
                subtitle: "帳號或密碼錯誤",
                open: state === STATE.FAILURE,
                onClose: () => setState(() => null)
            }}
        />
        <ForgetPwdModal
            open={state === STATE.FORGET}
            onCancel={() => setState(() => null)}
        />
    </>
};