import React from "react";
import { PopupButton } from "../Basic/button";
import { SearchOutlined } from "@ant-design/icons";

const Search: React.FC = () => {
    return <PopupButton
        icon={<SearchOutlined/>}
        search = {true}
        type="text"
    />;
}

export default Search;