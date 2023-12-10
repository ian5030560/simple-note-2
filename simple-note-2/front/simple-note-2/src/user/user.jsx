import React, { useState, useEffect } from "react";
import { Col, Row, Flex, ConfigProvider, theme, Typography, Modal, notification } from "antd";
import SideBar from "./component/sidebar";
import ToolBar from "./component/toolbar";
import Editor from "../editor/editor";
import defaultTheme from "../theme/default";
import changeEditorStyle from "./change";
import { useNavigate, useParams } from "react-router-dom";
import postData from "../util/post";

const { Text } = Typography;

async function checkUserLogin(username) {

    let response = await postData(
        "http://localhost:8000/signin_status/",
        { username: username },
    )

    return response.status === 200;
}

async function userLogout(username){
    
    let response = await postData(
        "http://localhost:8000/signout/",
        { username: username },
    )

    return response.status === 200;
}

const UserPage = () => {

    const [darken, setDarken] = useState(false);
    const { username } = useParams();
    const [logIn, setLogIn] = useState(true); // 改false
    const [open, setOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const navigate = useNavigate();

    // useEffect(() => {
    //     checkUserLogin(username)
    //         .then(value => {
    //             if (!value) navigate("/");
    //             setLogIn(value);
    //         })
    // }, [navigate, username]);

    useEffect(() => {
        changeEditorStyle(darken);
    }, [darken]);

    useEffect(() => {

        const listener = () => {
            changeEditorStyle(darken);
        }
        window.onkeydown = listener;
        window.onclick = listener;

        return () => {
            window.removeEventListener("keydown", listener);
            window.removeEventListener("click", listener);
        }

    }, [darken]);

    const handleLogoutOk = () => {
        setOpen(false);

        userLogout(username)
        .then((value) => {
            if(!value){
                api.error(
                    {
                        message: "登出發生錯誤，請重新登出",
                        placement: "top",
                    }
                )
            }
            setLogIn(false);
            navigate("/");
        })
    }

    return <>
        {logIn && <ConfigProvider
            theme={{
                ...defaultTheme(darken),
                algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}
        >
            <Index
                onThemeClick={() => setDarken(prev => !prev)}
                onLogout={() => setOpen(true)}
            />
        </ConfigProvider>}
        <Modal
            open={open}
            centered
            title="登出"
            okText="是"
            cancelText="否"
            okButtonProps={{
                danger: true,
            }}
            cancelButtonProps={{
                type: "default",
            }}
            onOk={handleLogoutOk}
            onCancel={() => setOpen(false)}
        >
            <Text>是否確定登出</Text>
        </Modal>
        {contextHolder}
    </>

}

export const Index = ({ onLogout, rootstyle }) => {

    const { token } = theme.useToken();

    return <Row style={{
        minHeight: "100%",
        backgroundColor: token.colorBgBase,
        ...rootstyle,
    }}>
        <Col
            span={4}
            style={{
                backgroundColor: token.colorBgBase,
            }}>
            <SideBar onLogout={onLogout} />
        </Col>
        <Col span={20}>
            <Flex style={{ width: "100%" }} vertical>
                {/* <ToolBar onThemeClick={onThemeClick} /> */}
                <Editor />
            </Flex>
        </Col>
    </Row>
}

export default UserPage;