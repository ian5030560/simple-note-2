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
  const [selectedKeys, setSeletedKeys] = useState(['0-0-0']);
  
  //點擊folder後將select改成當前路徑(key)
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    setSeletedKeys(selectedKeys);
    const number = treeData[0]?.children?.length || 0;
    handleNodeKeyChange(selectedKeys + "-" + number)
  };

  //icon
  const handleLeafIconChange = (value) => {
    if (value === "custom") {
      return setShowLeafIcon(<CheckOutlined />);
    }
    if (value === "true") {
      return setShowLeafIcon(true);
    }
    return setShowLeafIcon(false);
  };

  //輸入節點(folder,leaf)的名稱
  const [Name, setName] = useState(""); // 新节点名称
  const [Key, setKey] = useState(""); // 新节点键值
  const handleNodeNameChange = (e) => {
    setName(e.target.value);
  };

  //更改key
  const handleNodeKeyChange = (temp) => {
    setKey(temp);
  };

  // 利用長度判斷是新增leaf或是folder
  const length = (e) => {

    if (selectedKeys.length === 3) {
      addNode();
    } else {
      addFolder();
    }
  };  
  
  const addNode = () => {
    if (Name && Key) {
      // 创建新节点
      const newNode = {
        title: Name,
        key: Key,
        icon: <CarryOutOutlined />,
      };

      // 更新树形数据
      const updatedTreeData = [...treeData];
      //新增節點到對應folder下
      updatedTreeData[selectedKeys[0][2]].children[
        selectedKeys[0][4]
      ].children.push(newNode);

      // 清空输入框
      setName("");
      setKey("");
      setSeletedKeys("");
      setTreeData(updatedTreeData); // 更新树形数据
    }
  };

  const addFolder = () => {
    console.log(selectedKeys);
    if (Name && Key) {
      // 创建新节点对象
      const newFolder = {
        title: Name,
        key: Key,
        icon: <CarryOutOutlined />,
      };

      // 更新树形数据
      const updatedTreeData = [...treeData];
      //新增folder到對應folder下
      updatedTreeData[selectedKeys[0][2]].children.push(newFolder);

      // 清空输入框
      setName("");
      setKey("");
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
        placeholder="Name"
        value={Name}
        onChange={handleNodeNameChange}
      />
      {/* 新节点键值输入框 */}
      <Input
        placeholder="Key"
        value={Key}
        onChange={handleNodeKeyChange}
      />
      <button onClick={length}>Add Node or Folder</button>
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
