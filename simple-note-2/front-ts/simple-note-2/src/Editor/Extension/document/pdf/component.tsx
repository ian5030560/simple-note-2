import { pdfjs } from 'react-pdf';
import { Document, Page } from "react-pdf";
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { $getNodeByKey, ElementFormatType, NodeKey } from 'lexical';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Skeleton, theme } from 'antd';
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import styles from "./component.module.css";
import { useCallback, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import PDFNode from './node';
import 'react-pdf/dist/Page/TextLayer.css';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    '../../../../../node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

interface PDFprop {
    format?: ElementFormatType | null;
    nodeKey: NodeKey;
    className: Readonly<{
        base: string;
        focus: string;
    }>;
    url: string;
    width: number;
    height: number;
    index: number;
}
const PDF = ({ url, width, index, height, ...prop }: PDFprop) => {
    const [show, setShow] = useState(false);
    const pagesRef = useRef(0);
    const { token } = theme.useToken();
    const [editor] = useLexicalComposerContext();

    const handleClick = useCallback((diff: number) => {
        editor.update(() => {
            const node = $getNodeByKey(prop.nodeKey) as PDFNode;
            let id = (index + diff) % (pagesRef.current + 1)
            node.setIndex(id === 0 ? 1 : id);
        })
    }, [editor, index, prop.nodeKey]);

    return <BlockWithAlignableContents {...prop}>
        <div className={styles.pageActionMask} onPointerEnter={() => setShow(true)} 
            style={{width: width, height: height}}
            onPointerLeave={() => setShow(false)}>
            <Document file={url} noData={<p>此PDF檔案沒有內容</p>} error={<p>讀取發生錯誤</p>} loading={<Skeleton />}
                onLoadSuccess={({ numPages }) => { pagesRef.current = numPages }}>
                <Page pageNumber={index} width={width} height={height}/>
            </Document>

            <div className={!show ? styles.pageActionContainer : styles.pageActionContainerEnter}>
                <button className={styles.actionButton} style={{ backgroundColor: token.colorBgBase }}
                    onClick={() => handleClick(-1)}><FaCaretLeft /></button>
                <span>{index}/{pagesRef.current}</span>
                <button className={styles.actionButton} style={{ backgroundColor: token.colorBgBase }}
                    onClick={() => handleClick(1)}><FaCaretRight /></button>
            </div>

        </div>
    </BlockWithAlignableContents>;
}

export default PDF;