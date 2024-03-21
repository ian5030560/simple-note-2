import { pdfjs } from 'react-pdf';
import { Document, Page } from "react-pdf";
import { BlockWithAlignableContents } from "@lexical/react/LexicalBlockWithAlignableContents";
import { $getNodeByKey, ElementFormatType, NodeKey } from 'lexical';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Flex, Spin, theme } from 'antd';
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import styles from "./component.module.css";
import { useCallback, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import PDFNode from './node';
import 'react-pdf/dist/Page/TextLayer.css';
import { RiLoader2Fill } from 'react-icons/ri';
import FloatBoard from '../../UI/floatBoard';


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

        <FloatBoard content={
            <div className={!show ? styles.pageActionContainer : styles.pageActionContainerEnter}>
                <button className={styles.actionButton} style={{ backgroundColor: token.colorBgBase }}
                    onClick={() => handleClick(-1)}><FaCaretLeft /></button>
                <span>{index}/{pagesRef.current}</span>
                <button className={styles.actionButton} style={{ backgroundColor: token.colorBgBase }}
                    onClick={() => handleClick(1)}><FaCaretRight /></button>
            </div>
        } placement="bottom" onEnter={() => setShow(true)} onLeave={() => setShow(false)}>
            <div className={styles.pageActionMask} style={{width: width, height: height}}>
                <Document file={url} noData={<p className={styles.dangerText}>此PDF檔案沒有內容</p>} error={<p className={styles.dangerText}>讀取發生錯誤</p>}
                    loading={<Flex justify='center' align='center'><Spin indicator={<RiLoader2Fill size={24} />} spinning /></Flex>}
                    onLoadSuccess={({ numPages }) => { pagesRef.current = numPages }}>
                    <Page pageNumber={index} />
                </Document>
            </div>
        </FloatBoard>

    </BlockWithAlignableContents>;


}

export default PDF;