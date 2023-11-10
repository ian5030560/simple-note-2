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
  const [selectedKeys, setSeletedKeys] = useState(["0-0-0"]);

  //點擊folder後將select改成當前路徑(key)
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    setSeletedKeys(selectedKeys);

    if (selectedKeys.length === 1) {
      // 通过 selectedKeys[0] 获取选中的父节点的 key
      const selectedParentKey = selectedKeys[0];
      // 在 treeData 中找到选中的父节点
      const selectedParent = findNodeByKey(treeData, selectedParentKey);
      // 获取选中的父节点的子节点数量
      const numberOfChildren = selectedParent?.children?.length || 0;

      // 在这里可以根据需要进行处理，比如输出子节点数量
      console.log(
        `Number of children for ${selectedParent.title}: ${numberOfChildren}`
      );

      handleNodeKeyChange(selectedKeys + "-" + numberOfChildren);
    }
  };

  // 辅助函数，根据 key 在树形数据中找到对应的节点
  const findNodeByKey = (data, key) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const foundNode = findNodeByKey(node.children, key);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
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
    if (selectedKeys.length === 5) {
      addNode();
    } else {
      addFolder();
    }
  };

  const addNode = () => {
    if (Name && Key) {
      // 获取选中的父节点的 key
      const selectedParentKey = selectedKeys[0];
      // 在 treeData 中找到选中的父节点
      const selectedParent = findNodeByKey(treeData, selectedParentKey);

      if (selectedParent) {
        // 创建新节点
        const newNode = {
          title: Name,
          key: Key,
          icon: <CarryOutOutlined />,
        };

        // 新增节点到选中的父节点下
        selectedParent.children.push(newNode);

        // 清空输入框
        setName("");
        setKey("");
        setSeletedKeys([]);
        setTreeData([...treeData]); // 更新树形数据
      }
    }
  };

  const addFolder = () => {
    if (Name && Key) {
      // 获取选中的父节点的 key
      const selectedParentKey = selectedKeys[0];
      // 在 treeData 中找到选中的父节点
      const selectedParent = findNodeByKey(treeData, selectedParentKey);

      if (selectedParent) {
        // 创建新节点对象
        const newFolder = {
          title: Name,
          key: Key,
          icon: <CarryOutOutlined />,
          children: [], // 新增 folder 需要初始化 children 数组
        };

        // 新增 folder 到选中的父节点下
        selectedParent.children.push(newFolder);

        // 清空输入框
        setName("");
        setKey("");
        setSeletedKeys([]);
        setTreeData([...treeData]); // 更新树形数据
      }
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
      <Input placeholder="Name" value={Name} onChange={handleNodeNameChange} />
      {/* 新节点键值输入框 */}
      <Input placeholder="Key" value={Key} onChange={handleNodeKeyChange} />
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
