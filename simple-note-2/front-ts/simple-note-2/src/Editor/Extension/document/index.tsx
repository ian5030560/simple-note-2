import { Extension } from "..";
import DocNode from "./doc/node";
import PDFNode from "./pdf/node";
import DocumentPlugin from "./plugin";
import styles from "./index.module.css";

const DocumentExtension: Extension = {
    plugins: [<DocumentPlugin/>],
    nodes: [PDFNode, DocNode],
    styleSheet: styles,
    theme: {
        document: "simple-note-2-document",
    },
}

export default DocumentExtension;