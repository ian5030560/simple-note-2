import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, Flex, Modal, Tabs, TabsProps } from "antd";
import { $getSelection, $isRangeSelection, LexicalCommand, createCommand, $getRoot, $isRootNode } from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./modal.module.css";
import { FaRegDotCircle } from "react-icons/fa";
import Tesseract from "tesseract.js";

const contraints: MediaTrackConstraints = {
  width: 500,
  height: 400,
  facingMode: "environment",
}
export const OPEN_IMAGE_TO_TEXT_MODAL: LexicalCommand<void> = createCommand();
const ImageToTextModal = () => {
  const [open, setOpen] = useState(false);
  const [editor] = useLexicalComposerContext();
  const ref = useRef<Webcam>(null);
  const [id, setId] = useState<string>("camera");
  const fileRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  // const {play, pause, stop, restart, camera, } = useWebcam({width: 500, height: 400, contraints})

  useEffect(() => {
    return editor.registerCommand(OPEN_IMAGE_TO_TEXT_MODAL, () => {
      setOpen(true);
      return false;
    }, 4);
  }, [editor]);

  useEffect(() => {
    if(!ref.current) return;

    let video = ref.current!.video!;
    function resize(){
      if(!maskRef.current) return;

      let {width, height} = video.getBoundingClientRect();
      let {offsetTop, offsetLeft} = video;
      maskRef.current.style.width = width + "px";
      maskRef.current.style.height = height + "px";
      maskRef.current.style.top = offsetTop + "px";
      maskRef.current.style.left = offsetLeft + "px";
    }
    
    video.addEventListener("resize", resize);
    
    return () => video.removeEventListener("resize", resize);
  });

  const insertText = useCallback((text: string) => {
    editor.update(() => {
      let selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        selection = $getRoot().selectEnd();
      }
      else {
        if ($isRootNode(selection.anchor.getNode())) {
          selection.insertParagraph();
        }
      }
      selection!.insertText(text);
    })
  }, [editor]);

  const handleClick = useCallback(async () => {
    let src = ref.current!.getScreenshot();
    if (!src) return;

    const { data: { text } } = await Tesseract.recognize(src);
    insertText(text);
  }, [insertText]);


  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    let file = e.target.files[0]
    let { data: { text } } = await Tesseract.recognize(file);
    insertText(text);

  }, [insertText]);

  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "camera",
        label: "照相",
        children: <Flex justify="center" align="center" style={{ position: "relative" }}>
          {open && id === "camera" &&
            <Webcam audio={false} width={500} height={400} ref={ref}
              videoConstraints={contraints} screenshotFormat="image/png" />
          }
          <div className={styles.cameraMask} ref={maskRef}/>
          <button className={styles.cameraButton} onClick={handleClick}>
            <FaRegDotCircle size={40} />
          </button>
        </Flex>
      },
      {
        key: "file",
        label: "上傳文件",
        children: <>
          <Button type="primary" block onClick={() => fileRef.current?.click()}>上傳</Button>
          <input type="file" accept="image/*" style={{ display: "none" }} ref={fileRef} onChange={handleUpload} />
        </>
      }
    ]
  }, [handleClick, handleUpload, id, open]);

  return <Modal title="圖文辨識" open={open} footer={null} width={600}
    centered onCancel={() => setOpen(false)}>
    <Tabs items={items} onChange={(key) => setId(key)} />
  </Modal>
}

export default ImageToTextModal;