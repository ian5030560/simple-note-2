import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Typography, Flex, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthModal, ForgetPwdModal } from "./modal";
import { STATE, validateMessages, AuthProp } from "./constant";
import useAPI from "../../util/api";
import useUser from "../../util/useUser";
import withPageTitle from "../../util/pageTitle";
import { Cookies } from "react-cookie";

const { Title } = Typography;

type SignInData = {
    username: string;
    password: string;
}
export default withPageTitle(function SignIn({ onChange }: AuthProp) {
    const [form] = Form.useForm();
    const [state, setState] = useState<STATE>();
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

        getToken().then(token => {
            new Cookies().set("token", token);
            signIn(username, password).then(ok => {
                if (!ok) {
                    throw new Error();
                }
                else {
                    _signIn(username);
                    setState(STATE.SUCCESS);
                }
            });
        }).catch(() => {
            new Cookies().remove("token", {path: "/"});
            setState(STATE.FAILURE);
        });

    }, [_signIn, getToken, signIn]);

    return <>
        <Form form={form} size="large" validateMessages={validateMessages} labelWrap autoComplete="on"
            onFinish={handleFinished} style={{ padding: "8px 16px" }}>
            <Title style={{ textAlign: "center" }}>登入</Title>
            <Form.Item label="帳號" name="username" rules={[{ required: true }]}>
                <Input autoComplete="username" placeholder="輸入你的帳號"/>
            </Form.Item>
            <Form.Item label="密碼" name="password" rules={[{ required: true, min: 8, max: 30, }]}>
                <Input.Password autoComplete="password" placeholder="輸入你的密碼"/>
            </Form.Item>
            <Form.Item>
                <Flex gap={"middle"}>
                    <Button type="primary" htmlType="submit" block
                        disabled={!submittable} loading={state === STATE.LOADING}>
                        提交
                    </Button>
                    <Button type="primary" htmlType="reset" block>清除</Button>
                </Flex>
            </Form.Item>
            <Form.Item noStyle>
                <Flex justify="end">
                    <Button type="link" onClick={onChange}>註冊</Button>
                    <Button type="link" onClick={() => setState(STATE.FORGET)}>忘記密碼</Button>
                </Flex>
            </Form.Item>
        </Form>
        <AuthModal
            success={{
                title: "登入成功",
                subtitle: "點擊確認跳轉至使用頁面",
                open: state === STATE.SUCCESS,
                onClose: async () => {
                    setState(undefined);
                    navigate("/note");
                }
            }}

            failure={{
                title: "登入失敗",
                subtitle: "帳號或密碼錯誤",
                open: state === STATE.FAILURE,
                onClose: () => setState(undefined)
            }}
        />
        <ForgetPwdModal
            open={state === STATE.FORGET}
            onCancel={() => setState(undefined)}
        />
    </>
}, "登入");