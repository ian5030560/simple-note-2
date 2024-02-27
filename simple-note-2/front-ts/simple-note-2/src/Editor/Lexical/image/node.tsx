import {
    DecoratorNode, EditorConfig, LexicalEditor, LexicalNode, NodeKey,
    SerializedLexicalNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput,
    $applyNodeReplacement
} from "lexical";
import React, { ReactNode, Suspense } from "react";
import { Skeleton } from "antd";
import { Spread } from "lexical/LexicalEditor";

const LazyImageView = React.lazy(() => import("./component"));

export interface ImageNodeProp {
    src: string,
    alt: string,
    width: number | "inherit",
    height: number | "inherit",
    nodeKey?: NodeKey,
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
    const img = domNode as HTMLImageElement;
    if (img.src.startsWith('file:///')) {
        return null;
    }
    const { alt, src, width, height } = img;
    const node = $createImageNode(src, alt, width, height);
    return { node };
}

type SerializedImageNode = Spread<Omit<ImageNodeProp, "key">, SerializedLexicalNode>;

export default class ImageNode extends DecoratorNode<React.ReactNode> {

    __src: string;
    __alt: string;
    __width: number | "inherit";
    __height: number | "inherit";

    constructor(src: string, alt: string, width?: number | "inherit", height?: number | "inherit", key?: NodeKey) {
        super(key);

        this.__src = src;
        this.__alt = alt;
        this.__width = width || "inherit";
        this.__height = height || "inherit";
    }

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__alt,
            node.__width,
            node.__height,
            node.__key,
        );
    }

    setWidth(width: number): void {
        this.getWritable().__width = width;
    }

    setHeight(height: number): void {
        this.getWritable().__height = height;
    }

    getWidth(): number | "inherit" {
        return this.__width;
    }

    getHeight(): number | "inherit" {
        return this.__height;
    }

    createDOM(_config: EditorConfig, _editor: LexicalEditor): HTMLElement {
        const span = document.createElement("span");

        const theme = _config.theme;
        const className = theme.image;

        if (className) span.className = className;

        return span;
    }

    updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
        return false;
    }

    getSrc(): string {
        return this.__src;
    }

    getAlt(): string {
        return this.__alt;
    }

    decorate(): ReactNode {
        return <Suspense fallback={<Skeleton.Image active={true} />}>
            <LazyImageView
                src={this.__src}
                alt={this.__alt}
                width={this.__width}
                height={this.__height}
                nodeKey={this.getKey()}
            />
        </Suspense>
    }

    static importJSON(_serializedNode: SerializedImageNode): ImageNode {
        const { src, alt, width, height } = _serializedNode;
        
        const node = $createImageNode(src, alt, width, height);

        return node;
    }

    exportJSON(): SerializedImageNode {
        return {
            src: this.getSrc(),
            alt: this.getAlt(),
            width: this.__width,
            height: this.__height,
            type: this.__type,
            version: 1,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__alt);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: (_: Node) => ({
                conversion: convertImageElement,
                priority: 0,
            })
        };
    }
}

export function $createImageNode(src: string, alt: string,
    width?: number | "inherit", height?: number | "inherit", key?: string): ImageNode {
    return $applyNodeReplacement(new ImageNode(src, alt, width, height, key));
}
export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode {
    return node instanceof ImageNode;
}