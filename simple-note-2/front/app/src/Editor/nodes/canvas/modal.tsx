import { useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import { Button, Flex, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { FloppyFill } from "react-bootstrap-icons";

interface CanvasModalProps {
    initData: ExcalidrawInitialDataState;
    open: boolean;
    onSave: (data: ExcalidrawInitialDataState) => void;
    onDiscard: () => void;
}
const CanvasModal = (prop: CanvasModalProps) => {
    const [api, callback] = useState<ExcalidrawImperativeAPI>();

    return <Modal open={prop.open} title="編輯圖畫" width={800} centered footer={null} closeIcon={null}
        styles={{ body: { height: 400 }, content: {height: 500} }}>
        <Flex justify="end">
            <Button type="text" icon={<DeleteOutlined />} size="large" onClick={prop.onDiscard} />
            <Button type="text" icon={<FloppyFill />} size="large"
                onClick={() => prop.onSave({ appState: api?.getAppState(), files: api?.getFiles(), elements: api?.getSceneElements() })} />
        </Flex>
        <Excalidraw excalidrawAPI={callback} initialData={prop.initData} />
    </Modal>
}

export default CanvasModal;