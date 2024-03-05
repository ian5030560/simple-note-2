import React from "react";
import { PopupButton } from "../UI/button";
import { SearchOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { SEARCH_TEXT } from "../../../Lexical/keywordSearch";

const Search: React.FC = () => {
    const [editor] = useLexicalComposerContext();

    return <PopupButton
        icon={<SearchOutlined/>}
        search = {true}
        type="text"
        // onChange={(value) => editor.dispatchCommand(SEARCH_TEXT, value)}
    />;
}

export default Search;