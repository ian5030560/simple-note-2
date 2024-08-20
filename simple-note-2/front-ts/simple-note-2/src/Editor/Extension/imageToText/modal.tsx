import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, Flex, Tabs, TabsProps } from "antd";
import { $getSelection, $isRangeSelection, LexicalCommand, createCommand, $getRoot, $isRootNode } from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./modal.module.css";
import { FaRegDotCircle } from "react-icons/fa";
import Tesseract from "tesseract.js";
import Modal from "../UI/modal";

const contraints: MediaTrackConstraints = {
  width: 500,
  height: 400,
  facingMode: "environment",
}
export const OPEN_IMAGE_TO_TEXT_MODAL: LexicalCommand<void> = createCommand();
const ImageToTextModal = () => {
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const camRef = useRef<Webcam>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!camRef.current) return;

    let video = camRef.current.video!;
    function resize() {
      if (!maskRef.current) return;

      let { width, height } = video.getBoundingClientRect();
      let { offsetTop, offsetLeft } = video;
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
    let src = camRef.current!.getScreenshot();
    if (!src) return;

    const { data: { text } } = await Tesseract.recognize(src);
    insertText(text);
    setOpen(false);

  }, [insertText]);


  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let file = e.target.files[0];

    let { data: { text } } = await Tesseract.recognize(file);
    insertText(text);
    setOpen(false);

  }, [insertText]);

  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "camera",
        label: "照相",
        children: <Flex justify="center" align="center" style={{ position: "relative" }}>
          {
            open && <Webcam audio={false} width={500} height={400} ref={camRef}
              videoConstraints={contraints} screenshotFormat="image/png" />
          }
          <div className={styles.cameraMask} ref={maskRef} />
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
  }, [handleClick, handleUpload, open]);

  return <Modal command={OPEN_IMAGE_TO_TEXT_MODAL} title="圖文辨識" open={open}
    onOpen={() => setOpen(true)} onClose={() => setOpen(false)} destroyOnClose>
    <Tabs items={items} defaultActiveKey="camera" />
  </Modal>
}

export default ImageToTextModal;