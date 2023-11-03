import React, { useState } from "react";
import {
  CarryOutOutlined,
  CheckOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Select, Switch, Tree, Input } from "antd";

const App = () => {
  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [selectedKeys, setSeletedKeys] = useState();
  
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    setSeletedKeys(selectedKeys);
  };

  const handleLeafIconChange = (value) => {
    if (value === "custom") {
      return setShowLeafIcon(<CheckOutlined />);
    }
    if (value === "true") {
      return setShowLeafIcon(true);
    }
    return setShowLeafIcon(false);
  };

  const [nodeName, setNodeName] = useState(""); // 新节点名称
  const [nodeKey, setNodeKey] = useState(""); // 新节点键值
  const handleNodeNameChange = (e) => {
    setNodeName(e.target.value);
  };

  const handleNodeKeyChange = (e) => {
    setNodeKey(e.target.value);
  };

  const addNode = () => {
    // console.log('addNode');
    if(!selectedKeys){
      setSeletedKeys([['.....']]);
      selectedKeys[0][0] = "0";
      selectedKeys[0][2] = "0";
      selectedKeys[0][4] = "0";
    }

    // console.log(selectedKeys[0][0]);
    // console.log(selectedKeys[0][2]);
    // console.log(selectedKeys[0][4]);
    if (nodeName && nodeKey) {
      // 创建新节点对象
      const newNode = {
        title: nodeName,
        key: nodeKey,
        icon: <CarryOutOutlined />,
      };

      // 更新树形数据
      const updatedTreeData = [...treeData];
      // 这里可以根据需要添加到合适的位置，示例中将新节点添加到第一个父节点下
      updatedTreeData[selectedKeys[0][2]].children[
        selectedKeys[0][4]
      ].children.push(newNode);

      // 清空输入框
      setNodeName("");
      setNodeKey("");
      setSeletedKeys("");
      setTreeData(updatedTreeData); // 更新树形数据
    }
  };

  const [treeData, setTreeData] = useState([
    {
      title: "parent 1",
      key: "0-0",
      icon: <CarryOutOutlined />,
      children: [
        {
          title: "parent 1-0",
          key: "0-0-0",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: "leaf",
              key: "0-0-0-0",
              icon: <CarryOutOutlined />,
            },
          ],
        },
        {
          title: "parent 1-1",
          key: "0-0-1",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: "leaf",
              key: "0-0-1-0",
              icon: <CarryOutOutlined />,
            },
          ],
        },
        {
          title: "parent 1-2",
          key: "0-0-2",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: "leaf",
              key: "0-0-2-0",
              icon: <CarryOutOutlined />,
            },
            {
              title: "leaf",
              key: "0-0-2-1",
              icon: <CarryOutOutlined />,
              switcherIcon: <FormOutlined />,
            },
          ],
        },
      ],
    },
    {
      title: "parent 2",
      key: "0-1",
      icon: <CarryOutOutlined />,
      children: [
        {
          title: "parent 2-0",
          key: "0-1-0",
          icon: <CarryOutOutlined />,
          children: [
            {
              title: "leaf",
              key: "0-1-0-0",
              icon: <CarryOutOutlined />,
            },
            {
              title: "leaf",
              key: "0-1-0-1",
              icon: <CarryOutOutlined />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        showLine: <Switch checked={!!showLine} onChange={setShowLine} />
        <br />
        <br />
        showIcon: <Switch checked={showIcon} onChange={setShowIcon} />
        <br />
        <br />
        showLeafIcon:{" "}
        <Select defaultValue="true" onChange={handleLeafIconChange}>
          <Select.Option value="true">True</Select.Option>
          <Select.Option value="false">False</Select.Option>
          <Select.Option value="custom">Custom icon</Select.Option>
        </Select>
      </div>
      {/* 名稱輸入框 */}
      <Input
        placeholder="Node Name"
        value={nodeName}
        onChange={handleNodeNameChange}
      />
      {/* 新节点键值输入框 */}
      <Input
        placeholder="Node Key"
        value={nodeKey}
        onChange={handleNodeKeyChange}
      />
      <button onClick={addNode}>Add Node</button>
      <Tree
        showLine={
          showLine
            ? {
                showLeafIcon,
              }
            : false
        }
        showIcon={showIcon}
        defaultExpandedKeys={["0-0-0"]}
        onSelect={onSelect}
        treeData={treeData}
      />
    </div>
  );
};
export default App;
