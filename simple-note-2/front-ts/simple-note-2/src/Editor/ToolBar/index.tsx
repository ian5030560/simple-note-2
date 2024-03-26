import { Button, Flex, FlexProps, theme, Typography } from "antd";
import React, { forwardRef, useEffect, useRef, useState } from "react"
import Divider from "./Component/UI/divider";
import { Plugin } from "../Extension/index";
import styles from "./index.module.css";
// import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";

interface ToolBarContainerProp extends FlexProps {
    $backgroundColor: string;
    $shadowColor: string;
    className: string | undefined;
}
const ToolBarContainer = forwardRef(({ $backgroundColor, $shadowColor, className, ...prop }: ToolBarContainerProp, ref: React.Ref<HTMLElement>) => <Flex ref={ref} className={[styles.toolBar, className].join(" ")} style={{ backgroundColor: $backgroundColor }} {...prop} />)
const ToolBarPlugin: Plugin<{ toolbars: React.ReactNode[] }> = ({ toolbars }) => {
    const { token } = theme.useToken();
    const [collapse, setCollapse] = useState(true);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent){
            let {clientX, clientY} = e;
            
            if(ref.current){
                let {x, width} = ref.current.getBoundingClientRect();
                setCollapse(!(clientX >= x && clientX <= x + width && clientY <= 40));
            }
        }

        window.addEventListener("mousemove", handleMouseMove);

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return <ToolBarContainer
            ref={ref}
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
}

export default ToolBarPlugin;