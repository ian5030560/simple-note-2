import { EditorThemeClasses, Klass, LexicalNode, LexicalNodeReplacement } from "lexical";
import Extensions, { Extension } from "./Extension"

type LoaderType = Required<Extension>;

export default function loader(): LoaderType {

    const plugins: Exclude<React.ReactNode, undefined>[] = [];
    const theme: EditorThemeClasses = {};
    const nodes: (Klass<LexicalNode> | LexicalNodeReplacement)[] = [];

    for(const extension of Extensions){
        plugins.push(...extension.plugins);
        if(extension.theme) Object.keys(extension.theme).forEach(key => theme[key] = extension.theme![key]);
        if(extension.nodes) nodes.push(...extension.nodes);
    }

    return {
        plugins: plugins,
        theme: theme,
        nodes: nodes,
    }
}