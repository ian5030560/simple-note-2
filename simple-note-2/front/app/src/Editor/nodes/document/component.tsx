import { Flex, Typography } from "antd";
import { filesize } from "filesize";
import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { FileEarmarkArrowUpFill } from "react-bootstrap-icons";
import { CloseButton } from "../../ui/button";

const { Text } = Typography;
interface DocumentProps {
    src: string;
    name: string;
    nodeKey: string;
}
export default function Document(prop: DocumentProps) {

    const [size, setSize] = useState<number>(0);
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        fetch(prop.src)
            .then((res) => res.blob())
            .then((blob) => setSize(blob.size))
    }, [prop.src]);

    const handleDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        editor.update(() => {
            const node = $getNodeByKey(prop.nodeKey);
            if (!node) return;
            node.remove();
        })
    }, [editor, prop.nodeKey]);

    return <Flex gap={8} align="center" style={{ padding: 8 }}
        onClick={() => window.open(prop.src, "_blank", "noreferrer")}>
        <FileEarmarkArrowUpFill />
        <Text strong style={{ marginRight: 8 }}>{prop.name}</Text>
        <Text>{filesize(size)}</Text>
        <CloseButton onClick={handleDelete} style={{ top: 3, right: 3, position: "absolute" }} />
    </Flex>
}
