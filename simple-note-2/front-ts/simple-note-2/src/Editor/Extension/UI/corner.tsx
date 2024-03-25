import { createPortal } from "react-dom"
import { useWrapper } from "../../Draggable/component"

export type Trigger = () => boolean;
export type Placement = "top" | "bottom" | "left" | "right";
export interface CornerProp{
    children: React.ReactNode,
    trigger: Trigger,
    placement: Placement[],
}
const Corner = (prop: CornerProp) => {
    const wrapper = useWrapper();

    return wrapper ? createPortal(prop.children, wrapper) : null;
}

export default Corner;