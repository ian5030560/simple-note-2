import { SerializedDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { DOMConversionMap, DOMExportOutput, EditorConfig, ElementFormatType, LexicalEditor, LexicalNode, Spread } from "lexical";
import React from "react";
import Load from "../UI/load";
import DecoratorBlockNode from "../basic/decoratorBlockNode";

export interface VideoNodeProp {
    width: number;
    height: number;
    src: string;
    format: ElementFormatType;
    nodeKey: string;
    className: Readonly<{
        base: string;
        focus: string;
    }>;
}

const LazyVideo = React.lazy(() => import("./component"));

export type SerializedVideoNode = Spread<{ width: number, height: number, src: string }, SerializedDecoratorBlockNode>;

function convertVideoElement(dom: HTMLElement) {
    const src = dom.getAttribute("src");
    const width = dom.getAttribute("width");
    const height = dom.getAttribute("height");

    if (src && width && height) {
        let node = $createVideoNode(parseFloat(width), parseFloat(height), src);
        return { node }
    }

    return null;
}

export default class VideoNode extends DecoratorBlockNode {

    __width: number;
    __height: number;
    __src: string;

    constructor(width: number, height: number, src: string, key?: string, format?: ElementFormatType) {
        super(format, key);
        this.__width = width;
        this.__height = height;
        this.__src = src;
    }

    static getType(): string {
        return "video";
    }

    static clone(_data: VideoNode): VideoNode {
        return new VideoNode(_data.__width, _data.__height, _data.__src, _data.__key, _data.__format);
    }

    static importJSON(_serializedNode: SerializedVideoNode): VideoNode {
        const node = $createVideoNode(_serializedNode.width, _serializedNode.height, _serializedNode.src);
        node.setFormat(_serializedNode.format);
        return node;
    }

    exportJSON(): SerializedVideoNode {
        return {
            ...super.exportJSON(),
            type: "video",
            version: 1,
            width: this.__width,
            height: this.__height,
            src: this.__src,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("video");
        element.setAttribute("width", this.__width + "");
        element.setAttribute("height", this.__height + "");
        element.setAttribute("src", this.__src);
        element.setAttribute("preload", "meta");
        element.setAttribute("controls", "true");
        element.setAttribute("playsinline", "true");

        return { element }
    }

    static importDOM(): DOMConversionMap | null {
        return {
            video: () => ({
                conversion: convertVideoElement,
                priority: 1,
            })
        }
    }

    updateDOM(): false {
        return false;
    }

    decorate(_: LexicalEditor, config: EditorConfig): JSX.Element {
        const className = this.getEmbedClass(config);

        return <Load width={this.__width} height={this.__height}>
            <LazyVideo
                width={this.__width}
                height={this.__height}
                format={this.__format}
                nodeKey={this.__key}
                src={this.__src}
                className={className} />
        </Load>
    }
}

export function $createVideoNode(width: number, height: number, src: string): VideoNode {
    return new VideoNode(width, height, src);
};

export function $isVideoNode(node: LexicalNode | null | undefined): node is VideoNode {
    return node instanceof VideoNode;
}