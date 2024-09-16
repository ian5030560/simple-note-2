import React, { useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI, ExcalidrawInitialDataState } from "@excalidraw/excalidraw/types/types";
import { Button, Flex, Modal } from "antd";
import { FaSave, FaRegTrashAlt } from "react-icons/fa";

interface CanvasModalProps {
    initData: ExcalidrawInitialDataState;
    open: boolean;
    onSave: (data: ExcalidrawInitialDataState) => void;
    onDiscard: () => void;
}
const CanvasModal = (prop: CanvasModalProps) => {
    const [api, callback] = useState<ExcalidrawImperativeAPI>();

    return <Modal open={prop.open} title={null} width={800} centered footer={null} closeIcon={null}
        styles={{ body: { height: 400 }, content: {height: 500} }}>
        <Flex justify="end">
            <Button type="text" icon={<FaRegTrashAlt />} size="large" onClick={prop.onDiscard} />
            <Button type="text" icon={<FaSave />} size="large"
                onClick={() => prop.onSave({ appState: api?.getAppState(), files: api?.getFiles(), elements: api?.getSceneElements() })} />
        </Flex>
        <Excalidraw excalidrawAPI={callback} initialData={prop.initData} />
    </Modal>
}

export default CanvasModal;