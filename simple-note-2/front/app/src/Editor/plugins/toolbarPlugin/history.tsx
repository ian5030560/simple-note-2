import React from "react";
import { Flex, Button } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {UNDO_COMMAND, REDO_COMMAND} from "lexical";
import { UndoOutlined, RedoOutlined } from "@ant-design/icons";

const History: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    
    return <Flex gap={"small"}>
        <Button icon={<UndoOutlined />} type="text" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} />
        <Button icon={<RedoOutlined />} type="text" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} />
    </Flex>
}

export default History;