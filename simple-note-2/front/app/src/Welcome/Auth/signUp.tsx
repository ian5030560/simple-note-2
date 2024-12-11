import React, { useState, useEffect, useCallback } from "react";
import { Flex, Form, Input, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "./modal";
import { AuthProp, STATE, validateMessages } from "./constant";
import useAPI from "../../util/api";
import { uuid } from "../../util/uuid";
import useUser from "../../util/useUser";
import { Rule } from "antd/es/form";
import withPageTitle from "../../util/pageTitle";
import { Cookies } from "react-cookie";

const { Title } = Typography;

type SignUpData = {
    username: string;
    email: string;
    password: string;
}

class SignUpError extends Error {
    constructor(message) {
        super(message);
    }
};

export default withPageTitle(function SignUp({ onChange }: AuthProp) {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [cause, setCause] = useState("");
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [state, setState] = useState<STATE | null>();
    const [confirm, setConfirm] = useState(false);
    const values = Form.useWatch([], form);
    const { auth: { signUp }, note, jwt: { getToken } } = useAPI();
    const { signUp: _signUp } = useUser();

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(
                () => setSubmittable(true),
                () => setSubmittable(false)
            );
    }, [form, values]);

    const handleFinished = ({ username, email, password }: SignUpData) => {
        setState(STATE.LOADING);

        getToken().then(tokens => {
            new Cookies().set("token", tokens);
            signUp(username, password, email).then(async status => {
                if (status > 300) {
                    const map: { [key: number]: string } = {
                        401: "username 重複",
                        402: "email 重複",
                        400: "註冊錯誤，請重新輸入",
                    }
                    throw new SignUpError(map[status] ?? "發生重大錯誤");
                }
                else {
                    const result = await note.add(username, uuid(), "我的筆記", null, null);
                    if (!result) {
                        throw new SignUpError("發生重大錯誤");
                    }
                    else {
                        setState(STATE.SUCCESS);
                        _signUp(tokens);
                    }
                }
            })
        }).catch((e: Error) => {
            new Cookies().remove("token", {path: "/"});
            setCause(() => e instanceof SignUpError ? e.message : "發生重大錯誤");
            setState(() => STATE.FAILURE);
        });

    };

    const disabledConfirmRule: Rule = useCallback(() => ({
        validator: async (_: any, value: string) => Promise.resolve(setConfirm(value.length !== 0))
    }), []);

    const matchRule: Rule = useCallback(({ getFieldValue }) => ({
        validator: (_: any, value: string) => {
            if (!value || getFieldValue("password") === value) return Promise.resolve();
            return Promise.reject(new Error("未符合密碼"));
        }
    }), []);

    return <>
        <Form form={form} size="large" validateMessages={validateMessages} onFinish={handleFinished}
            labelWrap autoComplete="on" style={{ padding: "8px 16px" }}>
            <Title level={2} style={{ textAlign: "center" }}>註冊</Title>
            <Form.Item label="帳號" name="username" rules={[{ required: true }]}>
                <Input placeholder="輸入你的帳號" />
            </Form.Item>
            <Form.Item label="信箱" name="email" rules={[{ type: "email", required: true }]}>
                <Input type="email" placeholder="輸入你的信箱" />
            </Form.Item>
            <Form.Item label="密碼" name="password" rules={[{ required: true, min: 8, max: 30, type: "string" }, disabledConfirmRule]}>
                <Input.Password placeholder="輸入你的密碼" autoComplete="password"/>
            </Form.Item>
            <Form.Item label="確認密碼" name="confirm" dependencies={["password"]} rules={[{ required: true }, matchRule]}>
                <Input.Password disabled={!confirm} autoComplete="confirm" placeholder="確認你的密碼" />
            </Form.Item>
            <Form.Item>
                <Flex gap={"middle"}>
                    <Button type="primary" block htmlType="submit" disabled={!submittable}
                        loading={state === STATE.LOADING}>提交</Button>
                    <Button type="primary" block htmlType="reset">清除</Button>
                </Flex>
            </Form.Item>
            <Form.Item noStyle>
                <Flex justify="end">
                    <Button type="link" onClick={onChange}>登入</Button>
                </Flex>
            </Form.Item>
        </Form>
        <AuthModal
            success={{
                title: "註冊成功",
                subtitle: "註冊成功請返回首頁登入",
                open: state === STATE.SUCCESS,
                onClose: () => {
                    setState(() => null);
                    navigate(0);
                }
            }}
            failure={{
                title: "註冊失敗",
                subtitle: cause,
                open: state === STATE.FAILURE,
                onClose: () => setState(() => null)
            }} />
    </>
}, "註冊");