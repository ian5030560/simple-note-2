import React from "react";
import { BoldOutlined } from "@ant-design/icons";
import { ItalicOutlined } from "@ant-design/icons";
import { UnderlineOutlined } from "@ant-design/icons";
import { FontSizeOutlined } from "@ant-design/icons";
import { AlignLeftOutlined } from "@ant-design/icons";
import { AlignCenterOutlined } from "@ant-design/icons";
import { AlignRightOutlined } from "@ant-design/icons";
import { HighlightOutlined } from "@ant-design/icons";
import { BgColorsOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip } from "antd";

const Toolbar = ({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onFontSizeClick,
  onAlignLeftClick,
  onAlignCenterClick,
  onAlignRightClick,
  onHighlightClick,
  onTextColorsClick,
}) => {

  return (
  <Flex gap="small" vertical>
    <Flex wrap="wrap" gap="small">
      <Tooltip title="字體加粗">
        <Button
          type="primary"
          shape="circle"
          icon={<BoldOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onBoldClick}
        ></Button>
      </Tooltip>
      <Tooltip title="斜體">
        <Button
          type="primary"
          shape="circle"
          icon={<ItalicOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onItalicClick}
        ></Button>
      </Tooltip>
      <Tooltip title="文字底線">
        <Button
          type="primary"
          shape="circle"
          icon={<UnderlineOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onUnderlineClick}
        ></Button>
      </Tooltip>
      <Tooltip title="文字大小">
        <Button
          type="primary"
          shape="circle"
          icon={<FontSizeOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onFontSizeClick}
        ></Button>
      </Tooltip>
      <Tooltip title="置左">
        <Button
          type="primary"
          shape="circle"
          icon={<AlignLeftOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onAlignLeftClick}
        ></Button>
      </Tooltip>
      <Tooltip title="置中">
        <Button
          type="primary"
          shape="circle"
          icon={<AlignCenterOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onAlignCenterClick}
        ></Button>
      </Tooltip>
      <Tooltip title="置右">
        <Button
          type="primary"
          shape="circle"
          icon={<AlignRightOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onAlignRightClick}
        ></Button>
      </Tooltip>
      <Tooltip title="螢光筆">
        <Button
          type="primary"
          shape="circle"
          icon={<HighlightOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onHighlightClick}
        ></Button>
      </Tooltip>
      <Tooltip title="文字顏色">
        <Button
          type="primary"
          shape="circle"
          icon={<BgColorsOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={onTextColorsClick}
        ></Button>
      </Tooltip>
    </Flex>
  </Flex>
)};

export default Toolbar;

const ToolbarClickEvent = ({
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onFontSizeClick,
  onAlignLeftClick,
  onAlignCenterClick,
  onAlignRightClick,
  onHighlightClick,
  onTextColorsClick,
}) => {
  // 處理加粗按鈕點擊事件的函數
  const handleBoldClick = () => {
    // // 獲取當前的文字選擇範圍
    // const selection = window.getSelection();
    onBoldClick();
    // // 檢查是否有選擇的範圍
    // if (selection.rangeCount > 0) {
    //   // 獲取選擇範圍對象
    //   const range = selection.getRangeAt(0);
    //   // 獲取選擇的文字
    //   const selectedText = range.toString();
    //   // 檢查選擇的文字是否為非空
    //   if (selectedText.length > 0) {
    //     // 創建一個包裝選擇文字的 <b> 元素
    //     const boldElement = document.createElement('b');
    //     // 在 <b> 元素中添加選擇的文字內容
    //     boldElement.appendChild(document.createTextNode(selectedText));

    //     // 將選擇範圍內的內容替換為新創建的 <b> 元素
    //     range.deleteContents();
    //     range.insertNode(boldElement);
    //   }
    // }
  };

  // 處理斜體按鈕點擊事件的函數
  const handleItalicClick = () => {
    onItalicClick();
    // // 獲取當前的文字選擇範圍
    // const selection = window.getSelection();
    // // 檢查是否有選擇的範圍
    // if (selection.rangeCount > 0) {
    //   // 獲取選擇範圍對象
    //   const range = selection.getRangeAt(0);
    //   // 獲取選擇的文字
    //   const selectedText = range.toString();

    //   // 檢查選擇的文字是否為非空
    //   if (selectedText.length > 0) {
    //     // 創建一個包裝選擇文字的 <i> 元素
    //     const italicElement = document.createElement("i");
    //     // 在 <i> 元素中添加選擇的文字內容
    //     italicElement.appendChild(document.createTextNode(selectedText));

    //     // 將選擇範圍內的內容替換為新創建的 <i> 元素
    //     range.deleteContents();
    //     range.insertNode(italicElement);
    //   }
    // }
  };
  const handleUnderlineClick = () => {
    onUnderlineClick();
  };
  const handleFontSizeClick = () => {
    onFontSizeClick();
  };
  const handleAlignLeftClick = () => {
    onAlignLeftClick();
  };
  const handleAlignCenterClick = () => {
    onAlignCenterClick();
  };
  const handleAlignRightClick = () => {
    onAlignRightClick();
  };
  const handleHighlightClick = () => {
    onHighlightClick();
  };
  const handleTextColorsClick = () => {
    onTextColorsClick();
  };
};
