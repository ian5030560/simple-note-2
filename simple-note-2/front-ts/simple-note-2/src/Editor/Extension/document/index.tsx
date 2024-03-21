import { Extension } from "..";
import PDFNode from "./pdf/node";
import DocumentPlugin from "./plugin";

const DocumentExtension: Extension = {
    plugins: [<DocumentPlugin/>],
    nodes: [PDFNode],
}

export default DocumentExtension;