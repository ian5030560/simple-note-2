import { Skeleton } from "antd";
import katex from "katex";
import { DOMConversionMap, DOMConversionOutput, DOMExportOutput, EditorConfig, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import React from "react";
import { Suspense } from "react";
import MathNode from ".";

const LazyMathView = React.lazy(() => import("./component/block"));

type SerializedBlockMathNode = Spread<{ content: string }, SerializedLexicalNode>;

function $convertBlockMathElement(node: Node): DOMConversionOutput | null {
    const element = node as HTMLElement;
    const content = element.getAttribute("data-content");

    if(content){
        return { node: $createBlockMathNode(content) };
    }
    
    return null;
}
export default class BlockMathNode extends MathNode {

    constructor(content: string, key?: NodeKey) {
        super(content, key);
    }
    
    isInline(): false {
        return false;
    }

    static getType(): string {
        return "block-math";
    }

    static clone(node: BlockMathNode): BlockMathNode {
        return new BlockMathNode(
            node.__content,
            node.__key,
        );
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement("div");
        element.classList.add(_config.theme.math.block);
        return element;
    }

    updateDOM(): false {
        return false;
    }

    decorate(): React.ReactNode {
        return <Suspense fallback={<Skeleton.Node active style={{width: "100%"}}/>}>
            <LazyMathView content={this.__content} inline={false} nodeKey={this.__key}/>
        </Suspense>;
    }

    static importJSON(_serializedNode: SerializedBlockMathNode): BlockMathNode {
        const { content } = _serializedNode;
        return $createBlockMathNode(content);
    }

    exportJSON(): SerializedBlockMathNode {
        return {
            content: this.__content,
            type: this.__type,
            version: 1,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("div");
        element.setAttribute("data-content", this.__content);
        if(this.__content){
            katex.render(this.__content, element, {
                displayMode: true,
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
            "block-math": () => ({
                conversion: $convertBlockMathElement,
                priority: 1,
            })
        };
    }
}

export function $createBlockMathNode(content: string) {
    return new BlockMathNode(content);
}

export function $isBlockMathNode(node: LexicalNode | null | undefined): node is BlockMathNode {
    return node instanceof BlockMathNode
}