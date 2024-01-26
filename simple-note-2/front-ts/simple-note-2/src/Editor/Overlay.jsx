import { DragOverlay } from "@dnd-kit/core";
import { theme } from "antd";
import PropTypes from 'prop-types';
import { useMemo } from "react";


const adjustTranslate = ({transform}) => {
    return {
        ...transform,
        x: transform.x + 30,
        y: transform.y - 20
    }
}

const Overlay = ({ id }) => {
    const { token } = theme.useToken();
    const innerHtml = useMemo(() => {
        return document.getElementById(id + "-content");
    }, [id]);

    return <DragOverlay adjustScale={false} modifiers={[adjustTranslate]}>
        <div dangerouslySetInnerHTML={{ __html: innerHtml.innerHTML }}
            style={{ width: `${innerHtml.clientWidth}px`, color: token.colorText, opacity: "0.3" }} />
    </DragOverlay>;
}

Overlay.propTypes = {
    id: PropTypes.string
}

export default Overlay;