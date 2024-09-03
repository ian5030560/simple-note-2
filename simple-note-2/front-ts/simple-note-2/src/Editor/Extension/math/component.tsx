import { useCallback, useEffect, useRef, useState } from "react";
import katex from "katex";
import { Input, Popover } from "antd";
import { $getNodeByKey, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isMathNode } from "./node";
import "katex/dist/katex.css";

interface MathEditorProps {
    // onSubmit: () => void;
    value: string;
    onValueChange: (value: string) => void;
}
const MathEditor = (props: MathEditorProps) => {
    return <div style={{ position: "relative" }}>
        <Input.TextArea placeholder="輸入katex語法" value={props.value} autoSize
            onChange={(e) => props.onValueChange(e.target.value)} />
    </div>
}

interface MathRenderProps {
    content: string;
    inline: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
}
export const MathRender = (props: MathRenderProps) => {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        katex.render(props.content, ref.current, {
            displayMode: props.inline,
            output: "html",
            strict: "warn",
            throwOnError: false,
            trust: false,
        })

    }, [props.content, props.inline]);

    return <>
        <img src="#" alt="" />
        <span style={props.style} ref={ref} tabIndex={-1} onClick={props.onClick} />
        <img src="#" alt="" />
    </>
}

interface MathViewProps extends MathRenderProps {
    nodeKey: NodeKey,
}
export default function MathView(props: MathViewProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");

    const handleOpenChange = useCallback((open: boolean) => {
        setOpen(open);
        if (!open && value.trim().length === 0) {
            editor.update(() => {
                const node = $getNodeByKey(props.nodeKey);
                node?.remove();
            });
        }
        else {
            editor.update(() => {
                const node = $getNodeByKey(props.nodeKey);
                if ($isMathNode(node)) {
                    setValue(node.getContent());
                }
            })
        }
    }, [editor, props.nodeKey, value]);

    const handleValueChange = useCallback((value: string) => {
        setValue(value);
        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey);
            if ($isMathNode(node)) {
                node.setContent(value);
            }
        });
    }, [editor, props.nodeKey]);

    return <Popover placement="bottom" arrow={false}
        onOpenChange={handleOpenChange} open={open} trigger="click"
        content={<MathEditor value={value} onValueChange={handleValueChange} />}>
        <MathRender content={props.content} inline={props.inline} />
    </Popover>
}