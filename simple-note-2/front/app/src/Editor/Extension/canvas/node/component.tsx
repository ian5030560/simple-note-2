import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import Resizer from "../../UI/resizer";
import { $getNodeByKey, CLICK_COMMAND, NodeKey } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { exportToSvg } from "@excalidraw/excalidraw";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "antd";
import { FaEdit } from "react-icons/fa";
import CanvasModal from "../modal";
import { $isCanvasNode } from ".";

const removeStyleFromSvg_HACK = (svg: SVGElement) => {
    const styleTag = svg?.firstElementChild?.firstElementChild;

    const viewBox = svg.getAttribute('viewBox');
    if (viewBox != null) {
        const viewBoxDimensions = viewBox.split(' ');
        svg.setAttribute('width', viewBoxDimensions[2]);
        svg.setAttribute('height', viewBoxDimensions[3]);
    }

    if (styleTag && styleTag.tagName === 'style') {
        styleTag.remove();
    }
};

interface CanvasComponentProps {
    data: ExcalidrawInitialDataState;
    nodeKey: NodeKey;
    width: number | "inherit";
    height: number | "inherit";
}
export default function CanvasComponent(prop: CanvasComponentProps) {

    const [isSelected, setSelected] = useLexicalNodeSelection(prop.nodeKey);
    const [content, setContent] = useState<string>("");
    const [editor] = useLexicalComposerContext();
    const ref = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(true);

    const handleResize = useCallback((width: number, height: number) => {
        editor.update(() => {
            const node = $getNodeByKey(prop.nodeKey);
            if ($isCanvasNode(node)) {
                node.setWidth(width);
                node.setHeight(height);
            }
        })
    }, [editor, prop.nodeKey]);


    useEffect(() => {
        async function getContent() {
            const { appState, elements, files } = prop.data;
            if (appState && elements && files) {
                const svg = await exportToSvg({ appState, elements, files });
                removeStyleFromSvg_HACK(svg);
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
                svg.setAttribute("display", "block");

                setContent(svg.outerHTML);
            }
        }
        getContent();
    }, [prop.data]);

    const handleSelected = useCallback((e: MouseEvent) => {
        if (ref.current?.contains(e.target as HTMLElement)) {
            setSelected(!isSelected);
        }
        return false;
    }, [isSelected, setSelected]);

    useEffect(() => editor.registerCommand(CLICK_COMMAND, handleSelected, 1), [editor, handleSelected]);

    const handleSave = useCallback((data: ExcalidrawInitialDataState) => {
        editor.update(() => {
            const node = $getNodeByKey(prop.nodeKey);
            if ($isCanvasNode(node)) {
                if ((data.elements && data.elements.length > 0) ||
                    (data.files && Object.keys(data.files).length > 0)) {
                    node.setData(data);
                }
                else {
                    node.remove();
                }
            }
        })

        setOpen(false);
    }, [editor, prop.nodeKey]);

    const handleDiscard = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(prop.nodeKey);
            if ($isCanvasNode(node)) {
                node.remove();
            }
        });

        setOpen(false);
    }, [editor, prop.nodeKey]);

    return <>
        <CanvasModal open={open} initData={prop.data} onSave={handleSave} onDiscard={handleDiscard} />
        {
            prop.data.elements && prop.data.elements.length > 0 && <Resizer onResize={handleResize} showHandle={isSelected}>
                <div>
                    <div dangerouslySetInnerHTML={{ __html: content }} ref={ref} style={{ width: prop.width, height: prop.height }} />
                    <Button style={{ position: "absolute", top: 0, right: 0 }} type="text" icon={<FaEdit />} size="large" onClick={() => setOpen(true)} />
                </div>
            </Resizer>
        }
    </>;
}