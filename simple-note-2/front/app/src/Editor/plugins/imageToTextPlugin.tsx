import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, Flex, Spin, Tabs, TabsProps } from "antd";
import { $getSelection, $isRangeSelection, LexicalCommand, createCommand, $getRoot, $isRootNode } from "lexical";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./imageToTextPlugin.module.css";
import { FaRegDotCircle } from "react-icons/fa";
import Tesseract, { createWorker } from "tesseract.js";
import Modal from "../ui/modal";

// const codes = require("../../../resource/tesseract.json").map((lang: { code: string, name: string }) => lang.code) as string[];
const codes = ["eng", "chi_sim", "chi_tra", "jpn", "kor"];

const contraints: MediaTrackConstraints = {
  width: 500,
  height: 400,
  facingMode: "environment",
}

function grayscale(data: ImageData) {
  const pixels = data.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];
    const value = (red * 6966 + green * 23436 + blue * 2366) >> 15;
    pixels[i] = value;
    pixels[i + 1] = value;
    pixels[i + 2] = value;
  }

  return data;
}

function horizontalFlip(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d")!;
  context.save();
  context.setTransform(-1, 0, 0, 1, canvas.width, 0);
  context.drawImage(canvas, 0, 0);
  const src = canvas.toDataURL();
  context.restore();
  return src;
}
export const OPEN_IMAGE_TO_TEXT_MODAL: LexicalCommand<void> = createCommand();
export default function ImageToTextPlugin(){
  const [editor] = useLexicalComposerContext();
  const [open, setOpen] = useState(false);
  const camRef = useRef<Webcam>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const worker = useRef<Tesseract.Worker>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (worker.current) return;
    async function bindWorker() {
      worker.current = await createWorker(codes);
    }
    bindWorker();
  }, []);

  useEffect(() => {
    if (!camRef.current) return;

    const video = camRef.current.video!;
    function resize() {
      if (!maskRef.current) return;

      const { width, height } = video.getBoundingClientRect();
      const { offsetTop, offsetLeft } = video;
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

  const prcoessImage = useCallback((src: string) => {
    if (!worker.current) return;
    setLoading(true);
    document.body.style.pointerEvents = "none";
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const context = canvas.getContext("2d")!;
      context.drawImage(img, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      grayscale(imageData);
      context.putImageData(imageData, 0, 0);
      const url = canvas.toDataURL();
      const { data: { text } } = await worker.current!.recognize(url);
      document.body.style.removeProperty("pointer-events");
      setLoading(false);
      insertText(text);
      setOpen(false);
    }

    img.src = src;

  }, [insertText]);

  const handleClick = useCallback(async () => {
    const canvas = camRef.current?.getCanvas();
    if (!canvas) return;
    const src = horizontalFlip(canvas);
    prcoessImage(src);
  }, [prcoessImage]);


  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (reader.result) prcoessImage(reader.result as string);
    })
    reader.readAsDataURL(file);

  }, [prcoessImage]);

  const items: TabsProps["items"] = useMemo(() => {
    return [
      {
        key: "camera",
        label: "照相",
        children: <Flex justify="center" align="center" style={{ position: "relative" }}>
          {
            open && <Webcam audio={false} width={500} height={400} ref={camRef}
              style={{ transform: "scaleX(-1)" }} videoConstraints={contraints}
              screenshotFormat="image/png" mirrored />
          }
          <div className={styles.cameraMask} ref={maskRef} />
          <button title="trigger" className={styles.cameraButton} onClick={handleClick}>
            <FaRegDotCircle size={40} />
          </button>
        </Flex>
      },
      {
        key: "file",
        label: "上傳文件",
        children: <>
          <Button type="primary" block onClick={() => fileRef.current?.click()}>上傳</Button>
          <input aria-label="file" type="file" accept="image/*" style={{ display: "none" }} ref={fileRef} onChange={handleUpload} />
        </>
      }
    ]
  }, [handleClick, handleUpload, open]);

  return <Modal command={OPEN_IMAGE_TO_TEXT_MODAL} title="圖文辨識" open={open}
    onOpen={() => setOpen(true)} onClose={() => setOpen(false)} destroyOnClose
    styles={{ header: { pointerEvents: loading ? "none" : undefined } }}>
    <Tabs items={items} defaultActiveKey="camera" destroyInactiveTabPane />
    <Spin tip="辨識中" spinning={loading} size="large" fullscreen />
  </Modal>
}