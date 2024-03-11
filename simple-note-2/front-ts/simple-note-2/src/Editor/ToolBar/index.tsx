import { Flex, FlexProps, theme } from "antd";
import React from "react"
import Divider from "./Component/UI/divider";
import { Plugin } from "../Extension/index";
import styles from "./index.module.css";

interface ToolBarFlexProp extends FlexProps{
    $backgroundColor: string;
    $shadowColor: string;
}
const ToolBarFlex = ({$backgroundColor, $shadowColor, ...prop}: ToolBarFlexProp) => <Flex className={styles.toolBar} style={{backgroundColor: $backgroundColor, boxShadow: `${$shadowColor} 1.95px 1.95px 2.6px`}} {...prop}/>
const ToolBarPlugin: Plugin<{toolbars: React.ReactNode[]}> = ({toolbars}) => {
    const { token } = theme.useToken();

    return <ToolBarFlex
        $backgroundColor={token.colorBgBase}
        $shadowColor={token.colorText}
        justify="space-evenly"
    >
        {toolbars[0]}
        {
            toolbars.slice(1).map((element, index) => <React.Fragment key={index}>
                <Divider key={index}/>
                {element}
            </React.Fragment>)
        }
    </ToolBarFlex>
}

export default ToolBarPlugin;