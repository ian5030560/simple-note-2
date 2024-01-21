import { DragOverlay } from "@dnd-kit/core";
import { theme } from "antd";
import PropTypes from 'prop-types';
import { useMemo } from "react";

const Overlay = ({id}) => {
    const {token} = theme.useToken();
    const innerHtml = useMemo(() => {
        return document.getElementById(id + "-content");
    }, [id]);

    return <DragOverlay adjustScale={false}>
        <div dangerouslySetInnerHTML={{__html: innerHtml.outerHTML}} 
        style={{width: `${innerHtml.clientWidth}px`, color: token.colorText, opacity: "0.3"}}/>
    </DragOverlay>;
}

Overlay.propTypes = {
    element: PropTypes.array,
}

export default Overlay;