import { DOMConversionMap, DOMExportOutput, DecoratorNode, EditorConfig, LexicalEditor, LexicalNode, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import Load from "../../UI/load";
import { lazy } from "react";

type Dimension = number | "inherit";

export type SerializedCanvasNode = Spread<
    {
        data: ExcalidrawInitialDataState;
        width: Dimension;
        height: Dimension;
    },
    SerializedLexicalNode
>;

function convertCanvasElement(dom: HTMLSpanElement) {
    if (!dom.hasAttribute("data-canvas-data")) return null;

    let data = JSON.parse(dom.getAttribute("data-canvas-data")!);
    let { width: widthStr, height: heightStr } = window.getComputedStyle(dom);

    const width = !widthStr ? "inherit" : parseInt(widthStr, 10);
    const height = !heightStr ? "inherit" : parseInt(heightStr, 10);

    const node = $createCanvasNode();
    node.__data = data;
    node.__width = width;
    node.__height = height;

    return { node }
}

const LazyCanvasComponent = lazy(() => import("./component"));

export default class CanvasNode extends DecoratorNode<JSX.Element> {
    __width: Dimension;
    __height: Dimension;
    __data: ExcalidrawInitialDataState;

    constructor(width: Dimension = "inherit", height: Dimension = "inherit", data?: ExcalidrawInitialDataState, key?: NodeKey) {
        super(key);
        this.__width = width;
        this.__height = height;
        this.__data = data || {};
    }

    static getType(): string {
        return "canvas";
    }

    static clone(_data: CanvasNode): CanvasNode {
        return new CanvasNode(
            _data.__width,
            _data.__height,
            _data.__data,
            _data.__key,
        )
    }

    static importJSON(_serializedNode: SerializedCanvasNode): CanvasNode {
        return new CanvasNode(
            _serializedNode.width,
            _serializedNode.height,
            _serializedNode.data,
        )
    }

    exportJSON(): SerializedCanvasNode {
        return {
            width: this.__width,
            height: this.__height,
            data: this.__data,
            type: this.__type,
            version: 1,
        }
    }

    createDOM(_config: EditorConfig): HTMLSpanElement {
        const span = document.createElement('span');
        const className = _config.theme.image;

        span.style.width = this.__width + 'px';
        span.style.height = this.__height + 'px';

        if (className) {
            span.classList.add(className);
        }

        return span;
    }

    updateDOM(): false {
        return false;
    }

    static importDOM(): DOMConversionMap<HTMLSpanElement> | null {
        return {
            span: () => ({
                conversion: convertCanvasElement,
                priority: 1,
            })
        }
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement('span');
        element.style.display = "inline-block";

        const content = editor.getElementByKey(this.__key);
        if (content) {
            const svg = content.querySelector('svg');
            if (svg) {
                element.innerHTML = svg.outerHTML;
            }
        }

        element.style.width = this.__width + 'px';
        element.style.height = this.__height + 'px';

        element.setAttribute("data-canvas-data", JSON.stringify(this.__data));
        return { element };
    }

    decorate(): JSX.Element {
        return <Load>
            <LazyCanvasComponent data={this.__data} nodeKey={this.__key} width={this.__width} height={this.__height}/>
        </Load>
    }

    setWidth(width: Dimension){
        this.getWritable().__width = width;
    }

    setHeight(height: Dimension){
        this.getWritable().__height = height;
    }

    getWidth(): Dimension {
        return this.getWritable().__width;
    }

    getHeight(): Dimension {
        return this.getWritable().__height;
    }

    setData(data: ExcalidrawInitialDataState){
        this.getWritable().__data = data;
    }

    getData(): ExcalidrawInitialDataState {
        return this.getWritable().__data;
    }
}

export function $createCanvasNode() {
    return new CanvasNode();
}

export function $isCanvasNode(node: LexicalNode | null): node is CanvasNode {
    return node instanceof CanvasNode
}