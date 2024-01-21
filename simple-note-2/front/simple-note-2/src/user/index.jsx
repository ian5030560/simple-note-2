import React, { useState } from "react";
import { Col, Row, Flex, ConfigProvider, theme, Typography, Modal, notification } from "antd";
import SideBar from "./SideBar";
import Editor from "../Editor";
import defaultTheme from "../theme/default";
import { BulbButton } from "../Welcome";
import User from "../service/user";
import { useCookies } from "react-cookie";

const { Text } = Typography;

const UserPage = () => {

    const [darken, setDarken] = useState(false);
    const [open, setOpen] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [{ username }] = useCookies(["username"]);

    const handleLogoutOk = () => {
        setOpen(false);

        User.logout(username)
            .then((value) => {
                if (!value) {
                    api.error(
                        {
                            message: "登出發生錯誤，請重新登出",
                            placement: "top",
                        }
                    )
                }
            })
    }

    return <>
        <ConfigProvider
            theme={{
                ...defaultTheme(darken),
                algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}
        >
            <Index
                onLogout={() => setOpen(true)}
            />
            <BulbButton lighten={!darken} onClick={() => setDarken(prev => !prev)} />
        </ConfigProvider>
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

export const Index = ({ onLogout, rootStyle }) => {

    const { token } = theme.useToken();

    return <Row style={{
        minHeight: "100%",
        backgroundColor: token.colorBgBase,
        ...rootStyle
    }}>
        <Col
            span={4}
            style={{
                backgroundColor: token.colorBgBase,
            }}>
            <SideBar onLogout={onLogout} />
        </Col>
        <Col span={20}>
            <Flex vertical>
                <Editor style={{
                    color: token.colorText,
                    paddingLeft: "5%",
                    paddingRight: "10%",
                    paddingTop: "5%",
                }} />
            </Flex>
        </Col>
    </Row>
}

export default UserPage;