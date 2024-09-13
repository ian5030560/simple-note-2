import type {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalNode,
    NodeKey,
    SerializedElementNode,
    Spread,
} from 'lexical';

import { addClassNamesToElement } from '@lexical/utils';
import { ElementNode } from 'lexical';

export type SerializedLayoutContainerNode = Spread<
    { number: number },
    SerializedElementNode
>;

function convertLayoutContainerElement(
    domNode: HTMLElement,
): DOMConversionOutput | null {
    const number = domNode.getAttribute("data-column-number");
    const isContainer = domNode.getAttribute("data-column-container");

    if (number && isContainer) {
        const node = $createColumnContainerNode(parseInt(number));
        return { node };
    }
    return null;
}

export class ColumnContainerNode extends ElementNode {

    __number: number;

    constructor(number: number, key?: NodeKey) {
        super(key);
        this.__number = number;
    }

    static getType(): string {
        return 'column-container';
    }

    static clone(node: ColumnContainerNode): ColumnContainerNode {
        return new ColumnContainerNode(node.__number, node.__key);
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = document.createElement('div');
        dom.style.gridTemplateColumns = `repeat(${this.__number}, 1fr)`
        dom.setAttribute("data-column-number", this.__number + "");
        if (typeof config.theme.column.container === 'string') {
            addClassNamesToElement(dom, config.theme.column.container);
        }
        return dom;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('div');
        element.style.gridTemplateColumns = `repeat(${this.__number}, 1fr)`;
        element.setAttribute('data-column-container', 'true');
        element.setAttribute("data-column-number", this.__number + "");
        return { element };
    }

    updateDOM(prevNode: ColumnContainerNode, dom: HTMLElement): boolean {
        if (prevNode.__number !== this.__number) {
            dom.setAttribute("data-column-number", this.__number + "");
            dom.style.gridTemplateColumns = `repeat(${this.__number}, 1fr)`;
        }
        return false;
    }

    static importDOM(): DOMConversionMap | null {
        return {
            div: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-column-container')) {
                    return null;
                }
                return {
                    conversion: convertLayoutContainerElement,
                    priority: 2,
                };
            },
        };
    }

    static importJSON(json: SerializedLayoutContainerNode): ColumnContainerNode {
        return $createColumnContainerNode(json.number);
    }

    isShadowRoot(): boolean {
        return true;
    }

    canBeEmpty(): boolean {
        return false;
    }

    exportJSON(): SerializedLayoutContainerNode {
        return {
            ...super.exportJSON(),
            number: this.__number,
            type: 'column-container',
            version: 1,
        };
    }

    getNumber(): number {
        return this.getLatest().__number;
    }

    setNumber(value: number) {
        this.getWritable().__number = value;
    }
}

export function $createColumnContainerNode(number: number): ColumnContainerNode {
    return new ColumnContainerNode(number);
}

export function $isColumnContainerNode(node: LexicalNode | null | undefined): node is ColumnContainerNode {
    return node instanceof ColumnContainerNode;
}