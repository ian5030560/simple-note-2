import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import PDFNode, { $createPDFNode } from "./pdf/node";
import { LexicalCommand, createCommand } from "lexical";
import DocumentModal from "./modal";
import DocumentNode from "../../nodes/document";

interface DocumentPayload {
    name: string;
    payload: any;
}
export const INSERT_FILE: LexicalCommand<DocumentPayload> = createCommand();

export default function DocumentPlugin(){
    const [editor] = useLexicalComposerContext();

    if (!editor.hasNodes([DocumentNode])) {
        throw new Error("DocumentPlugin: PDFNode or DocumentNode not registered in editor");
    }
    return <DocumentModal />;
}