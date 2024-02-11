import { Flex, theme } from "antd";
import React from "react"
import { LIST } from "./constant";
import Divider from "./Component/Basic/divider";
import { Plugin } from "../Lexical/Interface";
import styled, { css } from "styled-components";

const ToolBarFlex = styled(Flex)<{$backgroundColor: string, $shadowColor: string}>`
    height: 8%;
    position: sticky;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    align-items: center;
    ${({$backgroundColor, $shadowColor}) => css`
        background-color: ${$backgroundColor};
        box-shadow: ${$shadowColor} 1.95px 1.95px 2.6px;
    `}
`
const ToolBarPlugin: Plugin = () => {
    const { token } = theme.useToken();

    return <ToolBarFlex
        $backgroundColor={token.colorBgBase}
        $shadowColor={token.colorText}
        justify="space-evenly"
    >
        {LIST[0]}
        {
            LIST.slice(1).map((element, index) => <React.Fragment key={index}>
                <Divider key={index}/>
                {element}
            </React.Fragment>)
        }
    </ToolBarFlex>
}

export default ToolBarPlugin;