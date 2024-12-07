import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import MathView, { MathViewProps } from ".";
import { CloseButton } from "../../../ui/button";
import { $getNodeByKey } from "lexical";
import { useCallback } from "react";

type BlockMathViewProps = MathViewProps;
export default function BlockMathView(props: BlockMathViewProps) {
    const [editor] = useLexicalComposerContext();

    const handleDelete = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey);
            node?.remove();
        });
    }, [editor, props.nodeKey]);

    return <>
        <MathView {...props} />
        <CloseButton style={{ position: "absolute", top: 0, right: 0 }}
            onClick={handleDelete} />
    </>
}