import TableOfContents from "@lexical/react/LexicalTableOfContents";
import { Plugin } from "../..";

const TableOfContentsPlugin: Plugin = () => {

    return <TableOfContents>
        {
            (contents) => <>{contents}</>
        }
    </TableOfContents>;
}

export default TableOfContentsPlugin;