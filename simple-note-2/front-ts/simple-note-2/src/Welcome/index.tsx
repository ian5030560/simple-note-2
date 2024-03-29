import React, { useEffect, useState } from "react";
import TopBar, { TopBarProp } from "./topbar";
import Brand from "./brand";
import { Flex, ConfigProvider, FloatButton, theme } from "antd";
import Auth from "./Auth";
import { AlertFilled, AlertOutlined } from "@ant-design/icons";
import defaultTheme from "../theme/default";
import Intro from "./Intro";
import "../resource/root.css";
import { useCookies } from "react-cookie";
import User from "../service/user";
import { useNavigate } from "react-router-dom";

interface HeaderProp extends TopBarProp {
    backgroundColor: string,
}

const Header: React.FC<HeaderProp> = (prop: HeaderProp) => {
    return <Flex
        justify="space-around"
        align="center"
        style={{
            backgroundColor: prop.backgroundColor,
            height: "15%"
        }}>
        <Brand />
        <TopBar
            onIntroClick={prop.onIntroClick}
            onAuthClick={prop.onAuthClick}   
        />
    </Flex>
}

export interface BulbButtonProp {
    lighten?: boolean,
    onClick?: React.MouseEventHandler<HTMLElement>
}
export const BulbButton: React.FC<BulbButtonProp> = (prop: BulbButtonProp) => {
    return <FloatButton icon={prop.lighten ? <AlertFilled /> : <AlertOutlined />} onClick={prop.onClick} />
}

const WelcomePage: React.FC = () => {
    const [darken, setDarken] = useState<boolean>(false);

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

interface WelcomePageIndexProp {
    darken: boolean,
    onDarken: () => void
}
const Index: React.FC<WelcomePageIndexProp> = ({darken, onDarken}) => {

    const [content, setContent] = useState<React.JSX.Element>(<Intro />);
    const {token} = theme.useToken();
    const [{username}] = useCookies(["username"]);
    const navigate = useNavigate();

    useEffect(() => {
        if(username){
            User.checkSignIn(username)
            .then(async value => {
                if(value){
                    // let {treeData, selected, content} = await User.loadInfo(username);
                    // navigate(`${selected}`);
                    // localStorage.setItem("treeData", treeData);
                    // localStorage.setItem("content", content);
                }
            })
        }
    });

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