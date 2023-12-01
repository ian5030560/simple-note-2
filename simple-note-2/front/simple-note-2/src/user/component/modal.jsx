import React, {useState} from "react";
import {Modal, Input} from "antd";

const IndividualModal = ({open, onOk, ...ModalProp}) => {

    // const [] = useState();

    return <Modal title="輸入名稱" open={open} onOk={() => onOk} {...ModalProp}>
        <Input placeholder="輸入..."/>
    </Modal>
}

export {IndividualModal};