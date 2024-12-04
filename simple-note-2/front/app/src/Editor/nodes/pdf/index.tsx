import { DecoratorBlockNode, SerializedDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import { DOMConversionMap, DOMExportOutput, EditorConfig, ElementFormatType, LexicalEditor, Spread } from "lexical";
import PDF from "./component";

export type SerializedPDFNode = Spread<{width: number, height: number, src: string, index?:number}, SerializedDecoratorBlockNode>

function $convertPDFElement(dom: HTMLElement){
    const src = dom.getAttribute("src");
    const width = dom.getAttribute("width");
    const height = dom.getAttribute("height");
    if(src && width && height){
        const node = $createPDFNode(parseFloat(width), parseFloat(height), src);
        return {node};
    }

    return null;
}
export default class PDFNode extends DecoratorBlockNode {

    __width: number;
    __height: number;
    __src: string;
    __index: number;

    constructor(width: number, height: number, src: string, index?: number, format?: ElementFormatType, key?: string) {
        super(format, key);
        this.__width = width;
        this.__height = height;
        this.__index = index || 1;
        this.__src = src;
    }

    static getType(): string {
        return "pdf";
    }

    static clone(_data: PDFNode): PDFNode {
        return new PDFNode(
            _data.__width,
            _data.__height,
            _data.__src,
            _data.__index,
            _data.__format,
            _data.__key
        )
    }

    setWidth(width: number) {
        this.getWritable().__width = width;
    }

    getWidth(): number {
        return this.getWritable().__width;
    }

    setHeight(height: number) {
        this.getWritable().__height = height;
    }

    getHeight(): number {
        return this.getWritable().__height;
    }

    setSrc(src: string) {
        this.getWritable().__src = src;
    }

    getSrc(): string {
        return this.getWritable().__src;
    }
    
    setIndex(index: number) {
        this.getWritable().__index = index;
    }

    getIndex() {
        return this.getWritable().__index;
    }

    decorate(_: LexicalEditor, config: EditorConfig): JSX.Element {
        const embed = config.theme.embedBlock || {};
        const className = {
            base: embed.base || "",
            focus: embed.focus || "",
        }
        return <PDF
            url={this.__src}
            width={this.__width}
            height={this.__height}
            index={this.__index}
            className={className}
            format={this.__format}
            nodeKey={this.__key}
        />
    }

    updateDOM(): false {
        return false;
    }

    static importJSON(_serializedNode: SerializedPDFNode): PDFNode {
        const node = $createPDFNode(_serializedNode.width, _serializedNode.height, _serializedNode.src, _serializedNode.index);
        node.setFormat(_serializedNode.format);
        return node;
    }

    exportJSON(): SerializedPDFNode {
        return {
            ...super.exportJSON(),
            type: 'pdf',
            version: 1,
            width: this.__width,
            height: this.__height,
            src: this.__src,
            index: this.__index,
        }
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement("embed");
        element.setAttribute("width", this.__width + "");
        element.setAttribute("height", this.__height + "");
        element.setAttribute("src", this.__src);
        element.setAttribute("type", "application/pdf");
        return {element}
    }
    
    static importDOM (): DOMConversionMap | null{
        return {
            pdf: () => ({
                conversion: $convertPDFElement,
                priority: 1,
            })
        }
    }
}

export function $createPDFNode(width: number, height: number, src: string, index?: number): PDFNode {
    return new PDFNode(width, height, src, index);
}

export function $isPDFNode(node: PDFNode): node is PDFNode {
    return node instanceof PDFNode;
}
