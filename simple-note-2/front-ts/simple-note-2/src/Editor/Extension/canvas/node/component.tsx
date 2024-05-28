import { ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import Resizer from "../../UI/resizer";
import { CLICK_COMMAND, NodeKey } from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { exportToSvg } from "@excalidraw/excalidraw";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

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

    const handleResize = useCallback(() => {

    }, []);

    const handleStart = useCallback(() => {

    }, []);

    const handleEnd = useCallback(() => {

    }, []);


    useEffect(() => {
        async function getContent() {
            const { appState, elements, files } = prop.data;
            if (appState && elements && files) {
                let svg = await exportToSvg({ appState, elements, files });
                removeStyleFromSvg_HACK(svg);
                svg.setAttribute("width", "100%");
                svg.setAttribute("height", "100%");
                svg.setAttribute("display", "block");
          ;
                setContent(svg.outerHTML);
            }
        }
        getContent();
    }, [prop.data]);

    const handleClick = useCallback((e: MouseEvent) => {
        if (e.target === ref.current) {
            setSelected(!isSelected);
        }
        return false;
    }, [isSelected, setSelected]);

    useEffect(() => editor.registerCommand(CLICK_COMMAND, handleClick, 1), [editor, handleClick]);

    return <Resizer onResize={handleResize} onResizeStart={handleStart} onResizeEnd={handleEnd} showHandle={isSelected}>
        <div dangerouslySetInnerHTML={{ __html: content }} ref={ref} style={{ width: prop.width, height: prop.height }}></div>
    </Resizer>;
}

export { };