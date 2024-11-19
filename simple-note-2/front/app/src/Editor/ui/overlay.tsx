import { autoUpdate, flip, FloatingPortal, Placement, useFloating } from "@floating-ui/react";
import { createPortal } from "react-dom";

interface OverlayProps {
    open: boolean;
    children: React.JSX.Element;
    reference: HTMLElement | null;
    container: HTMLElement | null;
    placement: Placement
    preventOverflow?: boolean;
}
export default function Overlay(props: OverlayProps) {
    const { refs, floatingStyles } = useFloating({
        strategy: "absolute",
        elements: { reference: props.reference },
        placement: props.placement,
        whileElementsMounted: autoUpdate,
        middleware: props.preventOverflow ? [flip()] : undefined,
    });

    return <FloatingPortal root={props.container}>
        <div ref={refs.setFloating} style={floatingStyles}>
            {props.open && props.children}
        </div>
    </FloatingPortal>
}