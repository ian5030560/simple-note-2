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
  boldFont,
  italics,
  underline,
  fontSize,
  alignLeft,
  alignCenter,
  alignRight,
  highlight,
  textColors,
}) => (
  <Flex gap="small" vertical>
    <Flex wrap="wrap" gap="small">
      <Tooltip title="字體加粗">
        <Button
          type="primary"
          shape="circle"
          icon={<BoldOutlined />}
          style={{ backgroundColor: "black" }}
          onClick={handleBoldClick}
        ></Button>
      </Tooltip>
      <Tooltip title="斜體">
        <Button
          type="primary"
          shape="circle"
          icon={<ItalicOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
      <Tooltip title="文字底線">
        <Button
          type="primary"
          shape="circle"
          icon={<UnderlineOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
      <Tooltip title="文字大小">
        <Button
          type="primary"
          shape="circle"
          icon={<FontSizeOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
      <Tooltip title="置左">
        <Button
          type="primary"
          shape="circle"
          icon={<AlignLeftOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
      <Tooltip title="置中">
        <Button
          type="primary"
          shape="circle"
          icon={<AlignCenterOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
      <Tooltip title="置右">
        <Button
          type="primary"
          shape="circle"
          icon={<AlignRightOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
      <Tooltip title="螢光筆">
        <Button
          type="primary"
          shape="circle"
          icon={<HighlightOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
      <Tooltip title="文字顏色">
        <Button
          type="primary"
          shape="circle"
          icon={<BgColorsOutlined />}
          style={{ backgroundColor: "black" }}
        ></Button>
      </Tooltip>
    </Flex>
  </Flex>
);

export default Toolbar;


const handleBoldClick = () => {
  const selection = window.getSelection();
  
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText.length > 0) {
      // 創建一個包裝選擇文字的 <b> 元素
      const boldElement = document.createElement('b');
      boldElement.appendChild(document.createTextNode(selectedText));

      // 將選擇範圍內的內容替換為新創建的 <b> 元素
      range.deleteContents();
      range.insertNode(boldElement);
    }
  }
};