import { useState } from "react";
import OptionButtonGroup, { Option } from "./ui/optionButtonGroup";
import useSelectionListener from "./useSelectionListener";
import {
    INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND,
    $isListNode, INSERT_CHECK_LIST_COMMAND, ListType
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isRangeSelection, LexicalCommand } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { ListOl, ListUl, ListCheck } from "react-bootstrap-icons";

const size = 16;
const options: Option[] = [
    {
        key: "number",
        icon: <ListOl size={size} />
    },
    {
        key: "bullet",
        icon: <ListUl size={size} />
    },
    {
        key: "check",
        icon: <ListCheck size={size} />
    }
]

const LISTCOMMANDS: { [x: string]: LexicalCommand<void> } = {
    number: INSERT_ORDERED_LIST_COMMAND,
    bullet: INSERT_UNORDERED_LIST_COMMAND,
    check: INSERT_CHECK_LIST_COMMAND,
}

export default function List() {
    const [type, setType] = useState<ListType | null>(null);
    const [editor] = useLexicalComposerContext();

    useSelectionListener((selection) => {
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const parent = $findMatchingParent(node, (p) => $isListNode(p));
            setType($isListNode(parent) ? parent.getListType() : null);
        }

        return false;
    }, 1)

    return <OptionButtonGroup options={options} value={type ?? undefined}
        onSelect={(key) => {
            const isSame = type === key;
            editor.dispatchCommand(isSame ? REMOVE_LIST_COMMAND : LISTCOMMANDS[key], undefined);
            setType(isSame ? null : key as ListType);
        }} />
}