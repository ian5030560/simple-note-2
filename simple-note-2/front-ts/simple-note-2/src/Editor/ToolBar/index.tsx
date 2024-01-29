import { Flex, theme } from "antd";
import React from "react"
import { LIST } from "./constant";
import Divider from "./Component/Basic/divider";
import "./index.css";
import { Plugin } from "../Lexical/Interface";

const ToolBarPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <Flex
        className="toolbar"
        style={{
            backgroundColor: token.colorBgBase,
            boxShadow: `3px 0px 5px ${token.colorText}`,
            width: `${100 / 6 * 5 - 0.5}%`
        }}

        justify="space-evenly"
    >
        {LIST[0]}
        {
            LIST.slice(1).map((element, index) => <React.Fragment key={index}>
                <Divider key={index}/>
                {element}
            </React.Fragment>)
        }
    </Flex>
}

export default ToolBarPlugin;