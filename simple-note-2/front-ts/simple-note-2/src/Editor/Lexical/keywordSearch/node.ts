import { EditorConfig, ElementNode, LexicalEditor, LexicalNode, BaseSelection, $isRangeSelection, $applyNodeReplacement,  $nodesOfType, SerializedElementNode, SerializedLexicalNode } from "lexical";
import { addClassNamesToElement } from "@lexical/utils";

export default class KeywordNode extends ElementNode {

    static getType(): string {
        return "keyword";
    }

    static clone(node: KeywordNode): KeywordNode {
        return new KeywordNode(node.__key);
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement("mark");
        addClassNamesToElement(element, _config.theme.keyword);
        
        return element;
    }

    // exportJSON(): SerializedElementNode<SerializedLexicalNode> {
    //     return null;
    // }
    
    updateDOM(_prevNode: unknown, _dom: HTMLElement, _config: EditorConfig): boolean {
        return false;
    }

    
    canInsertTextBefore(): false {
        return false;
    }

    canInsertTextAfter(): false {
        return false;
    }

    canBeEmpty(): false {
        return false;
    }

    isInline(): true {
        return true;
    }

    extractWithChild(
        child: LexicalNode,
        selection: BaseSelection,
        destination: 'clone' | 'html',
    ): boolean {
        if (!$isRangeSelection(selection)) {
            return false;
        }

        const anchorNode = selection.anchor.getNode();
        const focusNode = selection.focus.getNode();

        return (
            this.isParentOf(anchorNode) &&
            this.isParentOf(focusNode) &&
            selection.getTextContent().length > 0
        );
    }
}


export function $createKeywordNode(target: string) {
    return $applyNodeReplacement(new KeywordNode(target));
}

export function $isKeywordNode(node: LexicalNode): node is KeywordNode {
    return node instanceof KeywordNode;
}

export function skipHistoryUpdate(editor: LexicalEditor, callback: () => void): void {
    editor.update(callback, { tag: 'history-merge' });
}

export function cleanAllKeywords(editor: LexicalEditor): void {
    skipHistoryUpdate(editor, () => {
        const keywords = $nodesOfType(KeywordNode);
        for (let keyword of keywords) {
            keyword.remove();
        }
    });
}