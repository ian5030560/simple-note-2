import { useEffect } from "react";
import { Plugin } from "..";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import PDFNode, { $createPDFNode } from "./pdf/node";
import { LexicalCommand, LexicalNode, createCommand } from "lexical";
import { mergeRegister, $insertNodeToNearestRoot } from "@lexical/utils";
import DocumentModal from "./modal";
import DocNode, { $createDocNode } from "./document/node";

interface DocumentPayload {
    name: string;
    payload: any;
}
export const INSERT_FILE: LexicalCommand<DocumentPayload> = createCommand();

const DocumentPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([DocNode])) {
            throw new Error("DocumentPlugin: PDFNode or DocNode not registered in editor");
        }
        return mergeRegister(
            editor.registerCommand(INSERT_FILE, (payload) => {
                const { name, payload: p } = payload;
                let node: LexicalNode | undefined;
                // switch (name) {
                //     case "pdf":
                //         node = $createPDFNode(p.width, p.height, p.src);
                //         break;
                //     default:
                //         node = $createDocNode(p.src, p.name);
                // }
                node = $createDocNode(p.src, p.name);
                $insertNodeToNearestRoot(node);
                return true;
            }, 4),
        )
    })
    return <DocumentModal />;
}

export default DocumentPlugin;