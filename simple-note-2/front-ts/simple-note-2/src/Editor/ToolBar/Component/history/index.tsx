import React from "react";
import { Flex, Button } from "antd";
import { RedoOutlined, UndoOutlined } from "@ant-design/icons";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {UNDO_COMMAND, REDO_COMMAND} from "lexical";

const History: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    
    return <Flex>
        <Button icon={<UndoOutlined />} type="text" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} />
        <Button icon={<RedoOutlined />} type="text" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} />
    </Flex>
}

export default History;