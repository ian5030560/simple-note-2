import React, { useEffect, useState } from "react";
import TopBar from "./topbar";
import Brand from "./brand";
import { Flex, ConfigProvider, FloatButton, theme } from "antd";
import Auth from "./Auth";
import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import defaultTheme from "../theme/default";
import Intro from "./Intro";
// import { useCookies } from "react-cookie";
// import User from "../service/user";
// import { useNavigate } from "react-router-dom";

const Header = ({ backgroundColor, onIntroClick, onAuthClick }) => {
    return <Flex
        justify="space-around"
        align="center"
        style={{
            backgroundColor: backgroundColor,
            height: "15%"
        }}>
        <Brand />
        <TopBar
            onIntroClick={onIntroClick}
            onAuthClick={onAuthClick}   
        />
    </Flex>
}

export const BulbButton = ({ lighten, onClick }) => {
    return <FloatButton icon={lighten ? <AlertFilled /> : <AlertOutlined />} onClick={onClick} />
}

const WelcomePage = () => {
    const [darken, setDarken] = useState(false);

    const handleClick = () => {
        setDarken(!darken);
    }

    return <ConfigProvider
        theme={{
            ...defaultTheme(darken),
            algorithm: darken ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
    >
        <Index darken={darken} onDarken={handleClick}/>
    </ConfigProvider>
}

const Index = ({darken, onDarken}) => {

    const [content, setContent] = useState(<Intro />);
    const {token} = theme.useToken();
    // const [{username}] = useCookies(["username"]);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if(username){
    //         User.checkLogin(username)
    //         .then(async value => {
    //             if(value){
    //                 let {treeData, selected, content} = await User.loadInfo(username);
    //                 navigate(`${selected}`);
    //                 localStorage.setItem("treeData", treeData);
    //                 localStorage.setItem("content", content);
    //             }
    //         })
    //     }
    // });

    return <>
        <Header
            backgroundColor={token.colorPrimary}
            onAuthClick={() => setContent(<Auth />)}
            onIntroClick={() => setContent(<Intro />)}
        />
        {content}
        <BulbButton lighten={!darken} onClick={onDarken} />
    </>
}

export default WelcomePage;