import React, { useState } from "react";
import { Flex, Form, Input, theme } from "antd";
import AuthForm from "./basic";

const LogIn = ({ onChange }) => {

    const [form] = Form.useForm();

    return <AuthForm
        form={form}
        url="http://172.16.7.55/signin"
        title="登入"
        changeText="註冊"
        onChange={onChange}
        onSubmit={() => ({ id: "sign-in", ...form.getFieldsValue() })}
        success={{
            title: "登入成功",
            subtitle: "登入成功請返回主頁",
            onSuccess: () => { }
        }}
        failure={{
            title: "登入失敗",
            subtitle: "登入失敗請重新輸入",
            onFailure: () => { }
        }}
    >
        <Form.Item
            label="email"
            name="email"
            rules={[{
                type: "email",
                required: true,
            }]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label="password"
            name="password"
            rules={[{
                required: true,
                min: 8,
                max: 30
            }]}
        >
            <Input.Password />
        </Form.Item>
    </AuthForm>
}

const SignUp = ({ onChange }) => {

    const [form] = Form.useForm();

    return <AuthForm
        form={form}
        url="http://172.16.7.55/signin"
        title="註冊"
        changeText="登入"
        onChange={onChange}
        onSubmit={() => ({ id: "register", ...form.getFieldsValue() })}
        success={{
            title: "註冊成功",
            subtitle: "註冊成功請返回首頁登入",
            onSuccess: () => { }
        }}
        failure={{
            title: "註冊失敗",
            subtitle: "註冊失敗請重新輸入",
            onFailure: () => { }
        }}>
        <Form.Item
            label="email"
            name="email"
            rules={[{
                required: true,
            }]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label="password"
            name="password"
            rules={[{
                required: true,
                min: 8,
                max: 30
            }]}
        >
            <Input.Password />
        </Form.Item>
    </AuthForm>
}

const Authenticate = () => {

    const [current, setCurrent] = useState(0);
    const { token } = theme.useToken();

    return <Flex
        justify="center"
        align="center"
        style={{
            backgroundColor: token.colorBgBase,
        }}>
        {(current === 0) && <LogIn onChange={() => { setCurrent(1) }} />}
        {(current === 1) && <SignUp onChange={() => { setCurrent(0) }} />}
    </Flex>
}

export default Authenticate;