import { Skeleton } from "antd";
import katex from "katex";
import { $applyNodeReplacement, DecoratorNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import React from "react";
import { Suspense } from "react";

const LazyMathView = React.lazy(() => import("./component"));

type SerializedMathNode = Spread<{ content: string, inline: boolean }, SerializedLexicalNode>;

function $convertMathElement(node: Node): DOMConversionOutput | null {
    const element = node as HTMLElement;
    const content = element.getAttribute("data-content");
    const inline = element.tagName === "span";

    if(content){
        return { node: $createMathNode(content, inline) };
    }
    
    return null;
}
export default class MathNode extends DecoratorNode<React.ReactNode> {

    __content: string;
    __inline: boolean;

    constructor(content: string, inline?: boolean, key?: NodeKey) {
        super(key);
        this.__content = content;
        this.__inline = inline || false;
    }

    setContent(content: string) {
        this.getWritable().__content = content;
    }

    getContent() {
        return this.__content;
    }

    setInline(value: boolean) {
        this.__inline = value;
    }

    getInline() {
        return this.__inline;
    }

    static getType(): string {
        return "math";
    }

    static clone(node: MathNode): MathNode {
        return new MathNode(
            node.__content,
            node.__inline,
            node.__key,
        );
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement(this.__inline ? "span" : "div");
        element.classList.add(_config.theme.math);
        return element;
    }

    updateDOM(prevNode: MathNode): boolean {
        return this.__inline !== prevNode.__inline;
    }

    decorate(): React.ReactNode {

        return <Suspense fallback={<Skeleton.Node active style={{width: "30px"}}/>}>
            <LazyMathView content={this.__content} inline={this.__inline} nodeKey={this.__key}/>
        </Suspense>;
    }

    static importJSON(_serializedNode: SerializedMathNode): MathNode {
        const { content, inline } = _serializedNode;
        return $createMathNode(content, inline);
    }

    exportJSON(): SerializedMathNode {
        return {
            content: this.__content,
            inline: this.__inline,
            type: this.__type,
            version: 1,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement(this.__inline ? "span" : "div");
        element.setAttribute("data-content", this.__content);
        element.setAttribute("data-inline", this.__inline ? "true" : "false");
        if(this.__content){
            katex.render(this.__content, element, {
                displayMode: this.__inline,
                output: "html",
                strict: "warn",
                throwOnError: false,
                trust: false,
            })
        }

        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            math: () => ({
                conversion: $convertMathElement,
                priority: 1,
            })
        };
    }
}

export function $createMathNode(content: string, inline?: boolean) {
    return new MathNode(content, inline);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
    return node instanceof MathNode
}