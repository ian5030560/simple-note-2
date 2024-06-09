import { $getSelection, $isRangeSelection, LexicalCommand, createCommand } from "lexical";
import { Plugin } from "../index";
import { Modal, Flex, Typography, Button, ButtonProps } from "antd";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import styles from "./plugin.module.css";

interface MicroButtonProp extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>{
    $active?: boolean;
}
const MicroButton: React.FC<MicroButtonProp> = ({$active, ...prop}) => <button className={styles.microButton} 
{...prop} style={{color: $active ? "red" : "black"}}><FaMicrophone size={30}/></button>;

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
    const SpeechRecognition = useMemo(() => window.SpeechRecognition || window.webkitSpeechRecognition, []);
    const recognition = useRef<SpeechRecognition | null>(null);
    
    useEffect(() => {
        if (active && recognition.current === null) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.addEventListener("result", (e: SpeechRecognitionEvent) => {
                const resultItem = e.results.item(e.resultIndex);
                const { transcript } = resultItem.item(0);

                if (!resultItem.isFinal) {
                    return;
                }

                editor.update(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        if (transcript.match(/\s*\n\s*/)) {
                            selection.insertParagraph();
                        } else {
                            selection.insertText(transcript);
                        }
                    }
                });

                setActive(false);
                setHint(HINT.END);
            })
        }

        if (recognition.current) {
            if (active) {
                recognition.current.start();
            } else {
                recognition.current.stop();
            }
        }

        return () => {
            if (recognition.current !== null) {
                recognition.current.stop();
            }
        }
    }, [SpeechRecognition, active, editor]);

    const handleClick = useCallback(() => {
        
        if (active) {
            setHint(HINT.START);
        }
        else {
            setHint(HINT.SPEECH);

        }
        setActive(!active);
    }, [active]);


    return <Modal open={prop.open} footer={null}
        onCancel={() => prop.onClose?.()} title="語音辨識"
        centered>
        <Flex justify="center" align="center" vertical>
            {
                SpeechRecognition ?
                    <>
                        <MicroButton $active={active} onClick={handleClick}></MicroButton>
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