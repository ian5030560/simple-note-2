import { DOMConversionMap, DOMExportOutput, DecoratorNode, EditorConfig, LexicalEditor, Spread, SerializedLexicalNode, LexicalNode } from "lexical";
import React from "react";
import Document from "./component";
import Load from "../../ui/load";

export type SerializedDocumentNode = Spread<{ src: string, name: string }, SerializedLexicalNode>;

function convertDocElement(dom: HTMLElement) {
    const src = dom.getAttribute("data-document-src");
    const name = dom.getAttribute("data-document-name");

    if (src && name) {
        const node = $createDocumentNode(src, name);
        return { node };
    }

    return null;
}
export default class DocumentNode extends DecoratorNode<React.JSX.Element> {

    __src: string;
    __name: string;

    constructor(src: string, name: string, key?: string) {
        super(key);
        this.__src = src;
        this.__name = name;
    }

    static getType(): string {
        return "document";
    }

    static clone(_data: DocumentNode): DocumentNode {
        return new DocumentNode(
            _data.__src,
            _data.__name,
            _data.__key,
        )
    }

    setSrcAndName(src: string, name: string) {
        this.getWritable().__src = src;
        this.getWritable().__name = name;
    }

    getSrc(): string {
        return this.getWritable().__src;
    }

    getName(): string {
        return this.getWritable().__name;
    }

    decorate(): JSX.Element {
        return <Load width={"inherit"} height={"inherit"}>
            <Document src={this.__src} name={this.__name} nodeKey={this.__key} />
        </Load>
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const div = document.createElement("div");
        const className = _config.theme.document;

        if (className) div.className = className;

        return div;
    }

    updateDOM(): false {
        return false;
    }

    isInline(): boolean {
        return false;
    }

    static importJSON(_serializedNode: SerializedDocumentNode): DocumentNode {
        const node = $createDocumentNode(_serializedNode.src, _serializedNode.name);
        return node;
    }

    exportJSON(): SerializedDocumentNode {
        return {
            type: 'document',
            version: 1,
            src: this.__src,
            name: this.__name,
        }
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement('div');
        element.setAttribute("data-document-src", this.__src);
        element.setAttribute("data-document-name", this.__name);
        const content = editor.getElementByKey(this.__key);

        if (content) element.appendChild(content);

        return { element }
    }

    static importDOM(): DOMConversionMap | null {
        return {
            document: () => ({
                conversion: convertDocElement,
                priority: 1,
            })
        }
    }
}

export function $createDocumentNode(src: string, name: string): DocumentNode {
    return new DocumentNode(src, name);
}

export function $isDocumentNode(node: LexicalNode): node is DocumentNode {
    return node instanceof DocumentNode;
}