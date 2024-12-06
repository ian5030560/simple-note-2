import {
    EditorConfig, LexicalNode, NodeKey,
    SerializedLexicalNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput,
} from "lexical";
import React, { ReactNode, Suspense } from "react";
import { Spread } from "lexical/LexicalEditor";
import { Skeleton } from "antd";
import BasicImageNode from ".";
import { ImageViewProps } from "./component";

const LazyImageView = React.lazy(() => import("./component/inline"));
const INLINE_IMAGE_FLOAT = "data-inline-image-float";

function $convertImageElement(domNode: Node): null | DOMConversionOutput {
    const span = domNode as HTMLSpanElement;
    const img = span.firstChild as HTMLImageElement;
    if (img.src.startsWith('file:///')) {
        return null;
    }
    const { alt, src, width, height } = img;
    const float = span.getAttribute(INLINE_IMAGE_FLOAT);
    const node = $createInlineImageNode(src, alt, float as Float, width, height);
    return { node };
}

export type Float = "left" | "right";

type SerializedImageNode = Spread<Omit<ImageViewProps & { float?: Float }, "key">, SerializedLexicalNode>;


export default class InlineImageNode extends BasicImageNode {

    __float?: Float;

    constructor(src: string, alt: string, width?: number | "inherit", height?: number | "inherit", float?: Float, key?: NodeKey) {
        super(src, alt, width, height, key);
        this.__float = float;
    }

    static getType(): string {
        return "inline-image";
    }

    static clone(node: InlineImageNode): InlineImageNode {
        return new InlineImageNode(
            node.__src,
            node.__alt,
            node.__width,
            node.__height,
            node.__float,
            node.__key,
        );
    }

    setFloat(value: Float | undefined) {
        this.getWritable().__float = value;
    }

    getFloat() {
        return this.__float;
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const span = document.createElement("span");
        const theme = _config.theme;
        span.classList.add(theme.image!);
        span.classList.add(theme.inlineImage);
        if (this.__float) {
            span.setAttribute(INLINE_IMAGE_FLOAT, this.__float);
        }
        return span;
    }

    updateDOM(prev: InlineImageNode, node: HTMLElement): boolean {
        if (prev.__float !== this.__float) {
            if (this.__float) {
                node.setAttribute(INLINE_IMAGE_FLOAT, this.__float);
            }
            else {
                node.removeAttribute(INLINE_IMAGE_FLOAT);
            }
        }
        return false;
    }

    isInline(): boolean {
        return true;
    }

    decorate(): ReactNode {
        return <Suspense fallback={<Skeleton.Image active />}>
            <LazyImageView
                src={this.__src}
                alt={this.__alt}
                width={this.__width}
                height={this.__height}
                nodeKey={this.__key}
                float={this.__float} />
        </Suspense>
    }

    static importJSON(_serializedNode: SerializedImageNode): InlineImageNode {
        const { src, alt, width, height, float } = _serializedNode;
        const node = $createInlineImageNode(src, alt, float, width, height,);
        return node;
    }

    exportJSON(): SerializedImageNode {
        return {
            src: this.__src,
            alt: this.__alt,
            width: this.__width,
            height: this.__height,
            float: this.__float,
            type: this.__type,
            version: 1,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("span");
        if (this.__float) element.setAttribute(INLINE_IMAGE_FLOAT, this.__float);
        const image = document.createElement('img');
        image.setAttribute('src', this.__src);
        image.setAttribute('alt', this.__alt);
        image.setAttribute('width', this.__width.toString());
        image.setAttribute('height', this.__height.toString());
        element.appendChild(image);
        return { element };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: () => ({
                conversion: $convertImageElement,
                priority: 0,
            })
        };
    }
}

export function $createInlineImageNode(
    src: string, alt: string, float?: Float,
    width?: number | "inherit",
    height?: number | "inherit",
    key?: string): InlineImageNode {
    return new InlineImageNode(src, alt, width, height, float, key);
}
export function $isInlineImageNode(node: LexicalNode | null | undefined): node is InlineImageNode {
    return node instanceof InlineImageNode;
}