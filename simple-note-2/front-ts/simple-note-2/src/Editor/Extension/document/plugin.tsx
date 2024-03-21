import { useEffect } from "react";
import { Plugin } from "..";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import PDFNode, { $createPDFNode } from "./pdf/node";
import { LexicalCommand, LexicalNode, createCommand } from "lexical";
import { mergeRegister, $insertNodeToNearestRoot } from "@lexical/utils";
import DocumentModal from "./modal";

export type DocumentName = "pdf"
interface DocumentPayload {
    name: DocumentName;
    payload: {
        width: number;
        height: number;
        src: string;
    }
}
export const INSERT_FILE: LexicalCommand<DocumentPayload> = createCommand();

const DocumentPlugin: Plugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([PDFNode])) {
            throw new Error("DocumentPlugin: PDFNode not registered in editor");
        }
        return mergeRegister(
            editor.registerCommand(INSERT_FILE, (payload) => {
                const { name, payload: p } = payload;
                let node: LexicalNode | undefined;
                switch (name) {
                    case "pdf":
                        node = $createPDFNode(p.width, p.height, p.src);
                        break;
                    default:
                        throw new Error("Unknown Node");
                }
                $insertNodeToNearestRoot(node);
                return true;
            }, 4),
        )
    })
    return <DocumentModal />;
}

export default DocumentPlugin;