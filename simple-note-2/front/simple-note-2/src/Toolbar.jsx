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
  );
};

export default Toolbar;
