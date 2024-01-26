import { Button } from "antd";
import React from "react";
import { PlusOutlined } from "@ant-design/icons";

const Tbody = ({ children }) => {

    return <div style={{
        position: "relative"
    }}>
        <table>
            <tbody>
                {children}
            </tbody>
        </table>
        <Button icon={<PlusOutlined />} type="text"
            style={{ position: "absolute", right: "-20px" }}
        />
        <Button icon={<PlusOutlined />} type="text"
            style={{ position: "absolute", bottom: "-20px" }}
        />
    </div>
}

const Tr = ({ children }) => {
    return <tr>{children}</tr>
}

const Td = ({ children }) => {
    return <td>{children}</td>
}

const Table = {
    tbody: Tbody,
    tr: Tr,
    td: Td,
}

export default Table;