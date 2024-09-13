import { Extension } from "..";
import DocNode from "./document/node";
// import PDFNode from "./pdf/node";
import DocumentPlugin from "./plugin";
import "./index.css";

const DocumentExtension: Extension = {
    plugins: [<DocumentPlugin/>],
    nodes: [
        // PDFNode,
        DocNode
    ],
    theme: {
        document: "simple-note-2-document",
    },
}

export default DocumentExtension;