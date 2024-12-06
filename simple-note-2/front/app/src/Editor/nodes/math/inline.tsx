import { Skeleton } from "antd";
import katex from "katex";
import { DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import React from "react";
import { Suspense } from "react";
import MathNode from ".";

const LazyMathView = React.lazy(() => import("./component"));

type SerializedInlineMathNode = Spread<{ content: string }, SerializedLexicalNode>;

function $convertInlineMathElement(node: Node): DOMConversionOutput | null {
    const element = node as HTMLElement;
    const content = element.getAttribute("data-content");

    if(content){
        return { node: $createInlineMathNode(content) };
    }
    
    return null;
}
export default class InlineMathNode extends MathNode {

    constructor(content: string, key?: NodeKey) {
        super(content, key);
    }

    isInline(): true {
        return true;
    }

    static getType(): string {
        return "inline-math";
    }

    static clone(node: InlineMathNode): InlineMathNode {
        return new InlineMathNode(
            node.__content,
            node.__key,
        );
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement("span");
        element.classList.add(_config.theme.math.inline);
        return element;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): React.ReactNode {

        return <Suspense fallback={<Skeleton.Node active style={{width: "30px"}}/>}>
            <LazyMathView content={this.__content} inline={true} nodeKey={this.__key}/>
        </Suspense>;
    }

    static importJSON(_serializedNode: SerializedInlineMathNode): InlineMathNode {
        const { content } = _serializedNode;
        return $createInlineMathNode(content);
    }

    exportJSON(): SerializedInlineMathNode {
        return {
            content: this.__content,
            type: this.__type,
            version: 1,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("span");
        element.setAttribute("data-content", this.__content);
        if(this.__content){
            katex.render(this.__content, element, {
                displayMode: false,
                output: "html",
                strict: "warn",
                throwOnError: false,
                trust: false,
            });
        }

        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            "inline-math": () => ({
                conversion: $convertInlineMathElement,
                priority: 1,
            })
        };
    }
}

export function $createInlineMathNode(content: string) {
    return new InlineMathNode(content);
}

export function $isInlineMathNode(node: LexicalNode | null | undefined): node is InlineMathNode {
    return node instanceof InlineMathNode
}