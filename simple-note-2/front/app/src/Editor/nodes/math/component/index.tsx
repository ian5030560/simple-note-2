import { forwardRef, LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import katex from "katex";
import { Input, Popover } from "antd";
import { $getNodeByKey, NodeKey } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import "katex/dist/katex.css";
import { TextAreaRef } from "antd/es/input/TextArea";
import { $isMathNode } from "..";

interface MathEditorProps {
    value: string;
    onValueChange: (value: string) => void;
    inputRef: LegacyRef<TextAreaRef>;
}
const MathEditor = (props: MathEditorProps) => {
    return <div>
        <Input.TextArea ref={props.inputRef} placeholder="輸入katex語法" value={props.value} autoSize
            onChange={(e) => props.onValueChange(e.target.value)} />
    </div>
}

interface MathRenderProps extends React.HTMLAttributes<HTMLSpanElement> {
    content: string;
    inline: boolean;
}
export const MathRender = forwardRef((props: MathRenderProps, bindRef: React.ForwardedRef<HTMLElement>) => {
    const ref = useRef<HTMLSpanElement>(null);

    const { content, inline, style, ...rest } = props;

    useEffect(() => {

        if (!ref.current) return;

        katex.render(content, ref.current, {
            displayMode: !inline,
            output: "html",
            strict: "warn",
            throwOnError: false,
            trust: false,
        })

    }, [content, inline]);

    return <span ref={bindRef} {...rest}>
        <img src="#" alt="" />
        <span ref={ref} tabIndex={-1} style={style} />
        <img src="#" alt="" />
    </span>
})

export interface MathViewProps extends MathRenderProps {
    nodeKey: NodeKey,
}
export default function MathView(props: MathViewProps) {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const ref = useRef<TextAreaRef>(null);

    useEffect(() => {
        const body = document.body;

        function handleInput() {
            const element = ref.current;
            if (!element || !open) return;
            element.focus();
        }
        body.addEventListener("input", handleInput);

        return () => body.removeEventListener("input", handleInput);
    }, [open]);

    const handleOpenChange = useCallback((open: boolean) => {
        setOpen(open);
        if (!open && value.trim().length === 0) {
            editor.update(() => {
                const node = $getNodeByKey(props.nodeKey);
                node?.remove(props.inline);
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
    }, [editor, props.inline, props.nodeKey, value]);

    const handleValueChange = useCallback((value: string) => {
        setValue(value);
        editor.update(() => {
            const node = $getNodeByKey(props.nodeKey);
            if ($isMathNode(node)) {
                node.setContent(value);
            }
        });
    }, [editor, props.nodeKey]);

    useEffect(() => {
        const { body } = document;
        function handleEscape(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setOpen(false);
            }
        }
        body.addEventListener("keydown", handleEscape);

        return () => body.removeEventListener("keydown", handleEscape);
    }, []);

    return <Popover placement="bottom" open={open} trigger="click" onOpenChange={handleOpenChange}
        content={<MathEditor inputRef={ref} value={value} onValueChange={handleValueChange} />}>
        <MathRender content={props.content} inline={props.inline} />
    </Popover>
}