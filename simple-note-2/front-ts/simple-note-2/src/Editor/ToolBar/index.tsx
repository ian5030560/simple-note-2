import { Button, Flex, FlexProps, theme } from "antd";
import React, { useState } from "react"
import Divider from "./Component/UI/divider";
import { Plugin } from "../Extension/index";
import styles from "./index.module.css";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";

interface ToolBarContainerProp extends FlexProps {
    $backgroundColor: string;
    $shadowColor: string;
    className: string | undefined;
}
const ToolBarContainer = ({ $backgroundColor, $shadowColor, className, ...prop }: ToolBarContainerProp) => <Flex className={[styles.toolBar, className].join(" ")} style={{ backgroundColor: $backgroundColor, boxShadow: `${$shadowColor} 1.95px 1.95px 2.6px` }} {...prop} />
const ToolBarPlugin: Plugin<{ toolbars: React.ReactNode[] }> = ({ toolbars }) => {
    const { token } = theme.useToken();
    const [collapse, setCollapse] = useState(false);

    return <ToolBarContainer
        $backgroundColor={token.colorBgBase}
        $shadowColor={token.colorText}
        justify="space-evenly"
        className={collapse ? styles.collapsed : styles.notCollapsed}
    >
        {toolbars[0]}
        {
            toolbars.slice(1).map((element, index) => <React.Fragment key={index}>
                <Divider key={index} />
                {element}
            </React.Fragment>)
        }
        <Button className={collapse ? styles.collapsedButton : undefined} type="primary" 
            icon={!collapse ? <IoIosArrowDropup /> : <IoIosArrowDropdown/>} shape="circle"
            onClick={() => setCollapse(prev => !prev)} />
    </ToolBarContainer>

}

export default ToolBarPlugin;