import { pdfjs } from 'react-pdf';
import { Document, Page } from "react-pdf";
import { $getNodeByKey, ElementFormatType, NodeKey } from 'lexical';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button, Flex, Spin, Typography } from 'antd';
import styles from "./component.module.css";
import { useCallback, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import PDFNode from '.';
import 'react-pdf/dist/Page/TextLayer.css';
import FloatBoard from '../../ui/floatBoard';
import AlignableBlock from '../../ui/alignable';
import { CaretLeftFill, CaretRightFill, ArrowClockwise } from 'react-bootstrap-icons';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const { Text } = Typography;
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
    const [editor] = useLexicalComposerContext();

    const handleClick = useCallback((diff: number) => {
        editor.update(() => {
            const node = $getNodeByKey(prop.nodeKey) as PDFNode;
            const id = (index + diff) % (pagesRef.current);
            node.setIndex(id === 0 ? pagesRef.current : id);
        })
    }, [editor, index, prop.nodeKey]);

    return <AlignableBlock {...prop}>

        <FloatBoard content={
            <div className={!show ? styles.pageActionContainer : styles.pageActionContainerEnter}>
                <Button type='text' onClick={() => handleClick(-1)} icon={<CaretLeftFill />} size='small' />
                <Text>{index}/{pagesRef.current}</Text>
                <Button type='text' onClick={() => handleClick(1)} icon={<CaretRightFill />} size='small' />
            </div>
        } placement="bottom" onEnter={() => setShow(true)} onLeave={() => setShow(false)}>
            <div className={styles.pageActionMask} style={{ width: width, height: height }}>
                <Document file={url} noData={<p className={styles.dangerText}>此PDF檔案沒有內容</p>} error={<p className={styles.dangerText}>讀取發生錯誤</p>}
                    loading={<Flex justify='center' align='center'><Spin indicator={<ArrowClockwise />} spinning /></Flex>}
                    onLoadSuccess={({ numPages }) => { pagesRef.current = numPages }}>
                    <Page pageNumber={index} />
                </Document>
            </div>
        </FloatBoard>

    </AlignableBlock>;


}

export default PDF;