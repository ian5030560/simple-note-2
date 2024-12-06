import { DecoratorNode, LexicalNode, NodeKey } from "lexical";

export default class MathNode extends DecoratorNode<React.ReactNode> {
    __content: string;

    constructor(content: string, key?: NodeKey) {
        super(key);
        this.__content = content;
    }

    setContent(content: string) {
        this.getWritable().__content = content;
    }

    getContent() {
        return this.__content;
    }
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode{
    return node instanceof MathNode;
}