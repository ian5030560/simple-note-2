import { DragOverlay } from "@dnd-kit/core";
import { theme } from "antd";
import PropTypes from 'prop-types';
import { useMemo } from "react";

const Overlay = ({element}) => {
    const {token} = theme.useToken();
    const innerHtml = useMemo(() => {
        return document.getElementById(element[0].id + "-content");
    }, [element]);

    return <DragOverlay adjustScale={false}>
        <div dangerouslySetInnerHTML={{__html: innerHtml.outerHTML}} 
        style={{width: `${innerHtml.clientWidth}px`, color: token.colorText, opacity: "0.3"}}/>
    </DragOverlay>;
}

Overlay.propTypes = {
    element: PropTypes.array,
}

export default Overlay;