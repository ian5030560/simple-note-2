import type {
    DOMConversionMap,
    EditorConfig,
    LexicalNode,
    SerializedElementNode,
} from 'lexical';
import { addClassNamesToElement } from '@lexical/utils';
import { ElementNode } from 'lexical';

export type SerializedColumnItemNode = SerializedElementNode;

export class ColumnItemNode extends ElementNode {
    static getType(): string {
        return 'column-item';
    }

    static clone(node: ColumnItemNode): ColumnItemNode {
        return new ColumnItemNode(node.__key);
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = document.createElement('div');
        if (typeof config.theme.column.item === 'string') {
            addClassNamesToElement(dom, config.theme.column.item);
        }
        return dom;
    }

    updateDOM(): boolean {
        return false;
    }

    static importDOM(): DOMConversionMap | null {
        return {};
    }

    static importJSON(): ColumnItemNode {
        return $createColumnItemNode();
    }

    isShadowRoot(): boolean {
        return true;
    }

    exportJSON(): SerializedColumnItemNode {
        return {
            ...super.exportJSON(),
            type: 'column-item',
            version: 1,
        };
    }
}

export function $createColumnItemNode(): ColumnItemNode {
    return new ColumnItemNode();
}

export function $isColumnItemNode(
    node: LexicalNode | null | undefined,
): node is ColumnItemNode {
    return node instanceof ColumnItemNode;
}