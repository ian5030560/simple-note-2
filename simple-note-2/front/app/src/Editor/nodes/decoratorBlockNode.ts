import {DecoratorBlockNode as LexicalDecoratorBlockNode} from "@lexical/react/LexicalDecoratorBlockNode";
import { EditorConfig } from "lexical";

export default class DecoratorBlockNode extends LexicalDecoratorBlockNode {

    protected getEmbedClass(config: EditorConfig){
        const embed = config.theme.embedBlock || {};
        const className = {
            focus: embed.focus || "",
            base: embed.base || "",
        }

        return className;
    }
}