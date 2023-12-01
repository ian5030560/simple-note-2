import React, { useState, useEffect } from "react";
import { Col, Row, Flex, ConfigProvider, theme } from "antd";
import SideBar from "./component/sidebar";
import ToolBar from "./component/toolbar";
import Editor from "./component/editor/editor";
import defaultTheme from "../theme/default";
import changeEditorStyle from "./change";
import { useNavigate, useParams } from "react-router-dom";

async function checkUserLogin(username) {
    
    return await fetch("http://localhost:8000/signin_status/", {
        credentials: "include",
        body: JSON.stringify({ username: username }),
        method: "POST",
        headers: {
            "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "content-type": "application/json",
        },
    })

}

const UserPage = () => {

    const [darken, setDarken] = useState(false);
    const { username } = useParams();
    const [logIn, setLogIn] = useState(false);
    const navigate = useNavigate();
 
    useEffect(() => {
        checkUserLogin(username)
            .then(async res => {
                
                let result = await res.text();

                if (res.status !== 200 || !!result) {
                    navigate("/");
                    setLogIn(false);
                }
                else{
                    setLogIn(true);
                }

            });

    }, [navigate, username]);

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

    const handleThemeClick = () => {
        setDarken(prev => !prev);
    }

    return <>
        {logIn && <ConfigProvider
            theme={{
                ...defaultTheme(darken),
                algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}
        >
            <Index
                onThemeClick={handleThemeClick}
            />
        </ConfigProvider>}
    </>

}

const Index = ({ onThemeClick }) => {

    const { token } = theme.useToken();

    return <Row style={{
        minHeight: "100%",
        backgroundColor: token.colorBgBase
    }}>
        <Col
            span={4}
            style={{
                backgroundColor: token.colorBgBase,
            }}>
            <SideBar />
        </Col>
        <Col span={20}>
            <Flex style={{ width: "100%" }} vertical>
                <ToolBar onThemeClick={onThemeClick} />
                <Editor />
            </Flex>
        </Col>
    </Row>
}

export default UserPage;