import { Button, Flex, FlexProps, theme, Typography } from "antd";
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
const ToolBarContainer = ({ $backgroundColor, $shadowColor, className, ...prop }: ToolBarContainerProp) => <Flex className={[styles.toolBar, className].join(" ")} style={{ backgroundColor: $backgroundColor }} {...prop} />
const ToolBarPlugin: Plugin<{ toolbars: React.ReactNode[] }> = ({ toolbars }) => {
    const { token } = theme.useToken();
    const [collapse, setCollapse] = useState(false);

    return <div>
        <ToolBarContainer
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
        </ToolBarContainer>
        <button style={{ backgroundColor: token.colorBgBase, }}
            className={styles.collapsedButton}
            onClick={() => setCollapse(prev => !prev)}>
            <Typography>{!collapse ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}</Typography>
        </button>
    </div>

}

export default ToolBarPlugin;