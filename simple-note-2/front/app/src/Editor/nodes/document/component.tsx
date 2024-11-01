import { Button, Flex, Typography } from "antd";
import { MdUploadFile } from "react-icons/md";
import { filesize } from "filesize";
import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNodeByKey } from "lexical";
import { CloseOutlined } from "@ant-design/icons";

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
    
    return <Flex gap={5} onClick={() => window.open(prop.src, "_blank", "noreferrer")} style={{padding: 5}}>
        <MdUploadFile size={24} />
        <Text strong style={{ marginRight: 8 }}>{prop.name}</Text>
        <Text>{filesize(size)}</Text>
        <Button icon={<CloseOutlined />} type="default"
            onClick={handleDelete} style={{ top: 0, right: 0, position: "absolute" }} />
    </Flex>
}
