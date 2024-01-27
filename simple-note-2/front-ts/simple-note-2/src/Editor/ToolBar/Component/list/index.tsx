import React from "react";
import OptionGroup, { Option } from "../Basic/option";
import { OrderedListOutlined, UnorderedListOutlined } from "@ant-design/icons";

const LIST: Option[] = [
    {
        key: "ordered",
        icon: <OrderedListOutlined />
    },
    {
        key: "unordered",
        icon: <UnorderedListOutlined />
    }
]

const List: React.FC = () => {
    return <OptionGroup
        options={LIST}
    />
}

export default List;