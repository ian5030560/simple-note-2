import { createPortal } from "react-dom";
import { Plugin } from "../Interface";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $isLinkNode, LinkNode } from "@lexical/link";
import styled, { css } from "styled-components";
import { theme } from "antd";

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
function validateUrl(url: string): boolean {
    return url === 'https://' || URL_REGEX.test(url);
}

const LinkPlugin: Plugin = () => <LexicalLinkPlugin validateUrl={validateUrl} />

export default LinkPlugin;

const PADDING = 8;
const Floating = styled.div<{ $top: number, $left: number, $backgroundColor: string }>`
    position: absolute;
    padding: ${PADDING}px;
    border-radius: 5px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    ${({$top, $left, $backgroundColor}) => css`
        background-color: ${$backgroundColor};
        top: ${$top}px;
        left: ${$left}px;
    `}
`;

interface FloatingLinkProp {
    url?: string,
    top: number,
    left: number,
}
const Link: React.FC<FloatingLinkProp> = ({ url, top, left }) => {
    const {token} = theme.useToken();

    return <Floating
        $top={top}
        $left={left}
        $backgroundColor={token.colorBgBase}
    ><a href={url}>{url}</a></Floating>
}

export const FloatingLinkPlugin: Plugin = () => {

    const [editor] = useLexicalComposerContext();
    const [url, setUrl] = useState<string | undefined>(undefined);
    const [pos, setPos] = useState({ x: -10000, y: -10000 });

    useEffect(() => {
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    let node = selection.anchor.getNode();
                    let parent = $findMatchingParent(node, (n) => $isLinkNode(n)) as LinkNode | null;
                    let url: string | undefined = undefined;
                    let position: {x: number, y: number} = { x: -10000, y: -10000 };
                    if (parent) {
                        url = parent.getURL();
                        let element = editor.getElementByKey(parent.getKey())!;
                        let { x, y, height } = element.getBoundingClientRect();
                        position = {x: x, y: y - height - PADDING * 2};
                    }

                    setUrl(url);
                    setPos(position);
                }
            });
            return false;
        }, 1);
    }, [editor]);

    return createPortal(<Link top={pos.y} left={pos.x} url={url} />, document.body);
}