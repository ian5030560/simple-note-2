import {DecoratorBlockNode} from "@lexical/react/LexicalDecoratorBlockNode";
import { EditorConfig } from "lexical";

export default class EmbedBlockNode extends DecoratorBlockNode {

    protected getEmbedClass(config: EditorConfig){
        const embed = config.theme.embedBlock || {};
        const className = {
            focus: embed.focus || "",
            base: embed.base || "",
        }

        return className;
    }
}