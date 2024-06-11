import React, { useState, useEffect } from "react";
import { Form, Input, Typography, Flex, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { AuthModal, ForgetPwdModal } from "./modal";
import { APIs } from "../../util/api";
import { STATE, validateMessages, AuthProp } from "./constant";
import { useCookies } from "react-cookie";
import useAPI from "../../util/api";

const { Title } = Typography;

type SignInProp = AuthProp
const SignIn: React.FC<SignInProp> = ({ onChange }) => {
    const [form] = Form.useForm();
    const [state, setState] = useState<STATE | null>();
    const navigate = useNavigate();
    const [submittable, setSubmittable] = useState(false);
    const [, setCookie] = useCookies(["username"]);
    const values = Form.useWatch([], form);
    const signIn = useAPI(APIs.signIn);
    const loadNoteTree = useAPI(APIs.loadNoteTree);
    const [note, setNote] = useState("");

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

        values = { ...values, id: "sign-in", };

        signIn(values)
            .then((res) => res.status === 200 || res.status === 201)
            .then(async ok => {
                if (!ok) {
                    setState(STATE.FAILURE);
                }
                else {

                    let notes = await loadNoteTree({ username: values["username"] })
                        .then(async (res) => JSON.parse(await res.json()))
                        .catch((err) => console.log(err))
                        
                    setCookie("username", values["username"]);
                    setNote(notes[0].key.split("/")[0])

                    setState(STATE.SUCCESS);
                }

            })
            .catch(() => setState(STATE.FAILURE));
    };

    return <>
        <Form
            form={form} size="large" validateMessages={validateMessages}
            labelWrap style={{ width: "40%" }} autoComplete="on" onFinish={handleFinished}
        >
            <Title>登入</Title>
            <Form.Item label="帳號" name="username" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="密碼" name="password"
                rules={[{ required: true, min: 8, max: 30, }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                wrapperCol={{ offset: 2, }}
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
                    navigate(note);
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