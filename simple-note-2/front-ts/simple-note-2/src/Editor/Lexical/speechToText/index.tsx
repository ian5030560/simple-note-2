import { $getSelection, $isRangeSelection, $isTextNode, LexicalCommand, createCommand } from "lexical";
import { Plugin } from "../Interface";
import { Modal, Flex, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { FaMicrophone } from "react-icons/fa";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const MicroButton = styled.button<{ $active: boolean }>`
    background-color: white;
    padding: 10px;
    border-radius: 50px;
    cursor: pointer;
    border-color: gray;
    color: ${({ $active }) => $active ? "red" : "black"};
`

const HINT = {
    START: "開始錄音",
    SPEECH: "錄音中",
    END: "錄音結束",
};
interface SpeechModalProp {
    open?: boolean;
    onClose?: () => void;
}
const SpeechModal: React.FC<SpeechModalProp> = (prop) => {

    const [active, setActive] = useState(false);
    const [hint, setHint] = useState(HINT.START);
    const [editor] = useLexicalComposerContext();
    const {
        transcript,
        browserSupportsSpeechRecognition,
        listening,
        resetTranscript,
    } = useSpeechRecognition();

    useEffect(() => {
        if(transcript){
            editor.update(() => {
                const selection = $getSelection();
                if($isRangeSelection(selection)){
                    selection.insertText(transcript);
                }
                setHint(HINT.END);
                resetTranscript();
            })
        }
    }, [editor, resetTranscript, transcript]);

    const handleClick = useCallback(() => {
        if (active) {
            setHint(HINT.START);
            SpeechRecognition.stopListening();
        }
        else {
            setHint(HINT.SPEECH);
            SpeechRecognition.startListening();
        }
        setActive(!active);
    }, [active]);


    return <Modal open={prop.open} footer={null} onCancel={prop.onClose} title="語音辨識">
        <Flex justify="center" align="center" vertical>
            {
                browserSupportsSpeechRecognition ?
                    <>
                        <MicroButton $active={active} onClick={handleClick}><FaMicrophone size={30} /></MicroButton>
                        <div style={{ height: 5 }} />
                        <Typography.Text>{hint}</Typography.Text>
                    </> : <Typography.Text>瀏覽器不支持語音辨識</Typography.Text>
            }
        </Flex>
    </Modal>
}

export const SPEECH_TO_TEXT: LexicalCommand<undefined> = createCommand();

const SpeechToTextPlugin: Plugin = () => {
    const [open, setOpen] = useState(false);
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(SPEECH_TO_TEXT, () => {
            setOpen(true);
            return false;
        }, 4);

    }, [editor]);

    return <SpeechModal open={open} onClose={() => setOpen(false)} />;
};

export default SpeechToTextPlugin;