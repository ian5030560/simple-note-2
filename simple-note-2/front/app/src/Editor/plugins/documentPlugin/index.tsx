import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import PDFNode, { $createPDFNode } from "./pdf/node";
import { LexicalCommand, LexicalNode, createCommand } from "lexical";
import { mergeRegister, $insertNodeToNearestRoot } from "@lexical/utils";
import DocumentModal from "./modal";
import DocumentNode, { $createDocumentNode } from "../../nodes/document";

interface DocumentPayload {
    name: string;
    payload: any;
}
export const INSERT_FILE: LexicalCommand<DocumentPayload> = createCommand();

export default function DocumentPlugin(){
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([DocumentNode])) {
            throw new Error("DocumentPlugin: PDFNode or DocumentNode not registered in editor");
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
                //         node = $createDocumentNode(p.src, p.name);
                // }
                node = $createDocumentNode(p.src, p.name);
                $insertNodeToNearestRoot(node);
                return true;
            }, 4),
        )
    })
    return <DocumentModal />;
}