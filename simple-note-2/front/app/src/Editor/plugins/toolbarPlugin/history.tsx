import React from "react";
import { Flex, Button } from "antd";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {UNDO_COMMAND, REDO_COMMAND} from "lexical";
import { ArrowCounterclockwise, ArrowClockwise } from "../../../util/icons";

const History: React.FC = () => {
    const [editor] = useLexicalComposerContext();
    
    return <Flex gap={"small"}>
        <Button icon={<ArrowCounterclockwise />} type="text" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} />
        <Button icon={<ArrowClockwise />} type="text" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} />
    </Flex>
}

export default History;