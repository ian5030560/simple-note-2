import { EditorThemeClasses, Klass, LexicalNode } from "lexical";
import Extensions, { CSSModule, Extension } from "./Extension"

type LoaderType = Required<Extension>;

function load(): LoaderType {

    let plugins: Exclude<React.ReactNode, undefined>[] = [];
    let theme: EditorThemeClasses = {};
    let nodes: Klass<LexicalNode>[] = [];
    let styleSheet: CSSModule = {};

    for(let extension of Extensions){
        plugins.push(...extension.plugins);
        if(extension.theme) Object.keys(extension.theme).forEach(key => theme[key] = extension.theme![key]);
        if(extension.nodes) nodes.push(...extension.nodes);
        if(extension.styleSheet) Object.keys(extension.styleSheet).forEach(key => styleSheet[key] = extension.styleSheet![key]);
    }

    return {
        plugins: plugins,
        theme: theme,
        nodes: nodes,
        styleSheet: styleSheet,
    }
}

const Loader: LoaderType = load();

export default Loader;