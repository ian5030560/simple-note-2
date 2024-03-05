import React, { useState } from "react";
import OptionGroup, { Option } from "../UI/option";
import { OrderedListOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useSelectionListener } from "../Hooks";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND, $isListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalCommand } from "lexical";
import { $findMatchingParent } from "@lexical/utils";

const LIST: Option[] = [
    {
        key: "number",
        icon: <OrderedListOutlined />
    },
    {
        key: "bullet",
        icon: <UnorderedListOutlined />
    }
]

const LISTCOMMANDS: { [x: string]: LexicalCommand<void> } = {
    number: INSERT_ORDERED_LIST_COMMAND,
    bullet: INSERT_UNORDERED_LIST_COMMAND
}

const List: React.FC = () => {
    const [current, setCurrent] = useState<string | null>();
    const [editor] = useLexicalComposerContext();

    useSelectionListener((selection) => {
        const node = selection.getNodes()[0];
        let parent = $findMatchingParent(
            node,
            (p) => $isListNode(p)
        )
        if ($isListNode(parent)) {
            let type = parent.getListType();
            setCurrent(() => type);
        }
        else {
            setCurrent(() => null);
        }
    }, 1)

    return <OptionGroup
        options={LIST}
        select={(key) => current === key}
        onClick={(key) => {
            if (current === key) {
                editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
                setCurrent(() => null);
            }
            else {
                editor.dispatchCommand(LISTCOMMANDS[key], undefined);
                setCurrent(() => key);
            }
        }}
    />
}

export default List;