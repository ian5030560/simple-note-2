import { DecoratorNode, LexicalNode, NodeKey } from "lexical";

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

    setSrc(src: string) {
        this.__src = src;
    }

    getSrc(): string {
        return this.__src;
    }

    getAlt(): string {
        return this.__alt;
    }
}

export function $isImageNode(node: LexicalNode | null | undefined): node is ImageNode{
    return node instanceof ImageNode;
}