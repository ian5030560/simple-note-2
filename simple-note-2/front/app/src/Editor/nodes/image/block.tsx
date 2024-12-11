import {
    EditorConfig, LexicalNode, NodeKey,
    SerializedLexicalNode, DOMConversionMap, DOMConversionOutput, DOMExportOutput,
    ElementFormatType,
} from "lexical";
import React, { Suspense } from "react";
import { Spread } from "lexical/LexicalEditor";
import { Skeleton } from "antd";
import ImageNode from ".";
import { BlockImageViewProps } from "./component/block";

const LazyImageView = React.lazy(() => import("./component/block"));
const BLOCK_IMAGE_FORMAT = "data-block-image-format";

function $convertImageElement(domNode: Node): DOMConversionOutput | null {
    const div = domNode as HTMLDivElement;
    const img = div.firstChild as HTMLImageElement;
    if (img.src.startsWith('file:///')) {
        return null;
    }
    const format = div.getAttribute(BLOCK_IMAGE_FORMAT) ?? undefined;
    const { alt, src, width, height } = img;
    const node = $createBlockImageNode(src, alt, width, height, format as ElementFormatType | undefined);
    return { node };
}

type SerializedImageNode = Spread<Omit<BlockImageViewProps, "key" | "onError">, SerializedLexicalNode>;

export default class BlockImageNode extends ImageNode {

    __format?: ElementFormatType;

    constructor(src: string, alt: string, width?: number | "inherit", height?: number | "inherit", key?: NodeKey, format?: ElementFormatType) {
        super(src, alt, width, height, key);
        this.__format = format;
    }

    static getType(): string {
        return "block-image";
    }

    static clone(node: BlockImageNode): BlockImageNode {
        return new BlockImageNode(
            node.__src,
            node.__alt,
            node.__width,
            node.__height,
            node.__key,
            node.__format
        );
    }

    setFormat(format?: ElementFormatType) {
        this.getWritable().__format = format;
    }

    getFormat() {
        return this.getLatest().__format;
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const div = document.createElement("div");
        const theme = _config.theme;
        div.classList.add(theme.image!);
        div.classList.add(theme.blockImage);
        if (this.__format) div.setAttribute(BLOCK_IMAGE_FORMAT, this.__format);
        return div;
    }

    updateDOM(prev: BlockImageNode, node: HTMLElement): boolean {
        if (prev.__format !== this.__format) {
            if (this.__format) {
                node.setAttribute(BLOCK_IMAGE_FORMAT, this.__format);
            }
            else {
                node.removeAttribute(BLOCK_IMAGE_FORMAT);
            }
        }
        return false;
    }

    isInline(): false {
        return false;
    }

    decorate() {
        return <Suspense fallback={<Skeleton.Image active />}>
            <LazyImageView
                src={this.__src}
                alt={this.__alt}
                width={this.__width}
                height={this.__height}
                nodeKey={this.__key}
                format={this.__format} />
        </Suspense>
    }

    static importJSON(_serializedNode: SerializedImageNode): BlockImageNode {
        const { src, alt, width, height, format } = _serializedNode;
        const node = $createBlockImageNode(src, alt, width, height, format);
        return node;
    }

    exportJSON(): SerializedImageNode {
        return {
            src: this.__src,
            alt: this.__alt,
            width: this.__width,
            height: this.__height,
            format: this.__format,
            type: this.__type,
            version: 1,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("div");
        if (this.__format) element.setAttribute(BLOCK_IMAGE_FORMAT, this.__format);
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
            image: () => ({
                conversion: $convertImageElement,
                priority: 0,
            })
        };
    }
}

export function $createBlockImageNode(
    src: string, alt: string,
    width?: number | "inherit",
    height?: number | "inherit",
    format?: ElementFormatType,
    key?: NodeKey,
): BlockImageNode {
    return new BlockImageNode(src, alt, width, height, key, format);
}
export function $isBlockImageNode(node: LexicalNode | null | undefined): node is BlockImageNode {
    return node instanceof BlockImageNode;
}