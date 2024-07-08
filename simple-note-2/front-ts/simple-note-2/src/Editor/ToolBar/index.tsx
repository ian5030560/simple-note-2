import { Button, Flex, FlexProps, theme } from "antd";
import React, { forwardRef, useEffect, useRef, useState } from "react"
import Divider from "./Component/UI/divider";
import { Plugin } from "../Extension/index";
import styles from "./index.module.css";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";

interface ToolBarContainerProp extends FlexProps {
    $backgroundColor: string;
    $shadowColor: string;
    className: string | undefined;
}
const ToolBarContainer = forwardRef(({ $backgroundColor, $shadowColor, className, ...prop }: ToolBarContainerProp, ref: React.Ref<HTMLElement>) => <Flex ref={ref} className={[styles.toolBar, className].join(" ")} style={{ backgroundColor: $backgroundColor }} {...prop} />)
const ToolBarPlugin: Plugin<{ toolbars: React.ReactNode[] }> = ({ toolbars }) => {
    const { token } = theme.useToken();
    const [collapse, setCollapse] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    const [hide, setHide] = useState(false);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) {
            let { clientX, clientY } = e;

            if (ref.current) {
                let { x, width } = ref.current.parentElement!.getBoundingClientRect();
                setHide(!(clientX >= x && clientX <= x + width && clientY <= 70));
            }
        }

        function handleMouseLeave() {
            setHide(true);
        }

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseleave", handleMouseLeave);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseleave", handleMouseLeave);
        }
    }, []);

    return <div style={{ position: "relative" }} id="toolbar-container">
        <ToolBarContainer
            $backgroundColor={token.colorBgBase}
            $shadowColor={token.colorText}
            justify="space-evenly"
            gap={3}
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
        <Button type="primary" icon={collapse ? <IoIosArrowDropdown /> : <IoIosArrowDropup />}
            className={`${styles.collapsedButton} ${(hide && collapse) ? styles.collapsedButtonHide : ""}`}
            ref={ref} onClick={() => setCollapse(prev => !prev)} size="large" shape="circle" />
    </div>
}

export default ToolBarPlugin;