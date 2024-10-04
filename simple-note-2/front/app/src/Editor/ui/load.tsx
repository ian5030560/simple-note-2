import { Flex, Spin } from "antd";
import React, { Suspense } from "react";
import { RiLoader2Fill } from "react-icons/ri";

export interface LoadProp extends Omit<React.SuspenseProps, "fallback"> {
    width?: string | number;
    height?: string | number;
}
const Load = (prop: LoadProp) => {
    return <Suspense
        fallback={<Flex justify="center" align="center" style={{ width: prop.width, height: prop.width }}>
            <Spin indicator={<RiLoader2Fill size={24} />} spinning />
        </Flex>} {...prop} />
}
export default Load;
