import React, { useState, useEffect } from "react";
import { Flex, Form, Input, Typography, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthModal } from "./modal";
import { AuthProp, STATE, validateMessages } from "./constant";
import useAPI from "../../util/api";
import { uuid } from "../../util/secret";
import { defaultSeed } from "../../util/theme";
import useUser from "../../User/SideBar/useUser";

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

type SignUpProps = AuthProp;
const SignUp = ({ onChange }: SignUpProps) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [cause, setCause] = useState("");
    const [submittable, setSubmittable] = useState<boolean>(false);
    const [state, setState] = useState<STATE | null>();
    const values = Form.useWatch([], form);
    const { auth: { signUp }, note, jwt: { register }, theme } = useAPI();
    const { signUp: userSignUp } = useUser();

    useEffect(() => {
        form.validateFields({ validateOnly: true })
            .then(
                () => setSubmittable(true),
                () => setSubmittable(false)
            );
    }, [form, values]);

    const handleFinished = ({ username, email, password }: SignUpData) => {
        setState(STATE.LOADING);

        register(username, password, email).then(res => {
            if (!res.ok) throw new SignUpError("註冊錯誤，請重新輸入");
            return res.json();
        }).then(tokens => {
            signUp(username, password, email).then(async res => {
                if (!res.ok) {
                    const map: { [key: number]: string } = {
                        401: "username 重複",
                        402: "email 重複",
                        400: "註冊錯誤，請重新輸入",
                    }
                    throw new SignUpError(map[res.status] ?? "發生重大錯誤，請重新提交");
                }
                else {
                    const result = await Promise.all([
                        note.add(username, uuid(), "我的筆記", null, null),
                        theme.add(username, { name: "預設", data: defaultSeed })
                    ]).then(res => res.findIndex(it => !it.ok) === -1);

                    if (!result) {
                        setState(STATE.SUCCESS);
                        userSignUp(tokens);
                    }
                    else {
                        throw new SignUpError("發生重大錯誤，請重新提交");
                    }
                }
            })
        }).catch((e: Error) => {
            setCause(() => e instanceof SignUpError ? e.message : "發生重大錯誤，請重新提交");
            setState(() => STATE.FAILURE);
        });

    };

    return <>
        <Form form={form} size="large" validateMessages={validateMessages}
            labelWrap style={{ width: "40%" }} autoComplete="on" onFinish={handleFinished}>
            <Title>註冊</Title>
            <Form.Item label="帳號" name="username" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="信箱" name="email" rules={[{ type: "email", required: true }]}>
                <Input type="email" />
            </Form.Item>
            <Form.Item label="密碼" name="password" rules={[{ required: true, min: 8, max: 30, }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 2 }}>
                <Flex justify="space-between">
                    <Space>
                        <Button type="primary" htmlType="submit" disabled={!submittable}
                            loading={state === STATE.SUCCESS}>提交</Button>
                        <Button type="primary" htmlType="reset">清除</Button>
                    </Space>
                    <Space>
                        <Button type="link" onClick={() => onChange?.()}>登入</Button>
                    </Space>
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
};

export default SignUp;