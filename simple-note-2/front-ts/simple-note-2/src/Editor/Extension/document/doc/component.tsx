import { Flex, Typography } from "antd";
import { MdUploadFile } from "react-icons/md";
import { filesize } from "filesize";
import { useCallback, useEffect, useMemo, useState } from "react";

const { Text } = Typography;
interface DocumentProps {
    src: string;
    name: string;
}
export default function Document(prop: DocumentProps) {

    const [size, setSize] = useState<number>(0);

    useEffect(() => {
        fetch(prop.src)
            .then((res) => res.blob())
            .then((blob) => setSize(blob.size))
    }, [prop.src]);

    return <Flex onClick={() => window.open(prop.src)}>
        <MdUploadFile size={24}/>
        <Text strong style={{marginRight: 8}}>{prop.name}</Text>
        <Text>{filesize(size)}</Text>
    </Flex>
}
