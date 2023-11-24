import React, { useState } from "react";
import {
  CarryOutOutlined,
  CheckOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Button, Modal, Select, Switch, Tree, Input } from "antd";

/**
 *
 * @param {{defaultData: [
 *  {
 *  title: string,
 *  key: string,
 *  icon: JSX.Element,
 *  children: JSX.Element
 * }
 * ]}} param0
 * @returns
 */

const App = ({ defaultData }) => {
  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [selectedKeys, setSeletedKeys] = useState(["0-0-0"]); //預設路徑的key

  /** 點擊folder後將selectedKeys改成當前路徑(key) */
  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
    setSeletedKeys(selectedKeys);

    if (selectedKeys.length === 1) {
      /** 通過 selectedKeys[0] 獲取選擇的父節點的key */
      const selectedParentKey = selectedKeys[0];

      /** 在 treeData 中找到選中的父節點 */
      const selectedParent = findNodeByKey(treeData, selectedParentKey);

      /** 獲取選中的父節點的子節點數量 */
      const numberOfChildren = selectedParent?.children?.length || 0;

      /** 檢查選到的children */
      console.log(
        `Number of children for ${selectedParent.title}: ${numberOfChildren}`
      );

      /** 更改要新增的檔案的key */
      handleNodeKeyChange(selectedKeys + "-" + numberOfChildren);
    }
  };

  /** 輔助函數，根據 key 在樹型數據中找到對應的節點 */
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

  /** icon的更改 */
  const handleLeafIconChange = (value) => {
    if (value === "custom") {
      return setShowLeafIcon(<CheckOutlined />);
    }
    if (value === "true") {
      return setShowLeafIcon(true);
    }
    return setShowLeafIcon(false);
  };

  /** 輸入節點(folder,leaf)的名稱 */
  const [Name, setName] = useState(""); // 新節點名
  const [Key, setKey] = useState(""); // 新節點值(key)
  const handleNodeNameChange = (e) => {
    setName(e.target.value);
  };

  /** 更改key */
  const handleNodeKeyChange = (temp) => {
    setKey(temp);
  };

  /** 利用長度判斷是新增leaf或是folder */
  const length = (e) => {
    if (selectedKeys.length === 5) {
      addNode();
    } else {
      addFolder();
    }
  };

  const addNode = () => {
    if (Name && Key) {
      /** 獲取選中的父節點的 key */
      const selectedParentKey = selectedKeys[0];
      /** 在 treeData 中找到選中的父節點 */
      const selectedParent = findNodeByKey(treeData, selectedParentKey);

      if (selectedParent) {
        /** 新增新節點 */
        const newNode = {
          title: Name,
          key: Key,
          icon: <CarryOutOutlined />,
        };

        /** 新增節點到選中的父節點下 */
        selectedParent.children.push(newNode);

        /** 清空輸入框 */
        setName("");
        setKey("");
        setSeletedKeys([]);
        setTreeData([...treeData]); /** 更新樹型數據 */
      }
    }
  };

  const addFolder = () => {
    if (Name && Key) {
      /** 獲取選中的父節點的 key */
      const selectedParentKey = selectedKeys[0];
      /** 在 treeData 中找到選中的父節點 */
      const selectedParent = findNodeByKey(treeData, selectedParentKey);

      if (selectedParent) {
        /** 新增新資料夾對象 */
        const newFolder = {
          title: Name,
          key: Key,
          icon: <CarryOutOutlined />,
          children: [] /** 新增 folder 需要初始化 children 數據 */,
        };

        /** 新增 folder 到選中的父節點下 */
        selectedParent.children.push(newFolder);

        /** 清空輸入框 */
        setName("");
        setKey("");
        setSeletedKeys([]);
        setTreeData([...treeData]); /** 更新新樹型數據 */
      }
    }
  };

  /** 預設的第一個資料夾 */
  const [treeData, setTreeData] = useState(
    !defaultData
      ? [
          {
            title: "parent 1",
            key: "0-0",
            icon: <CarryOutOutlined />,
            children: [],
          },
        ]
      : defaultData
  );

  /** 設定的彈出視窗 */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //   {
  //     title: "parent 1",
  //     key: "0-0",
  //     icon: <CarryOutOutlined />,
  //     children: [
  //       {
  //         title: "parent 1-0",
  //         key: "0-0-0",
  //         icon: <CarryOutOutlined />,
  //         children: [
  //           {
  //             title: "leaf",
  //             key: "0-0-0-0",
  //             icon: <CarryOutOutlined />,
  //           },
  //         ],
  //       },
  //       {
  //         title: "parent 1-1",
  //         key: "0-0-1",
  //         icon: <CarryOutOutlined />,
  //         children: [
  //           {
  //             title: "leaf",
  //             key: "0-0-1-0",
  //             icon: <CarryOutOutlined />,
  //           },
  //         ],
  //       },
  //       {
  //         title: "parent 1-2",
  //         key: "0-0-2",
  //         icon: <CarryOutOutlined />,
  //         children: [
  //           {
  //             title: "leaf",
  //             key: "0-0-2-0",
  //             icon: <CarryOutOutlined />,
  //           },
  //           {
  //             title: "leaf",
  //             key: "0-0-2-1",
  //             icon: <CarryOutOutlined />,
  //             switcherIcon: <FormOutlined />,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     title: "parent 2",
  //     key: "0-1",
  //     icon: <CarryOutOutlined />,
  //     children: [
  //       {
  //         title: "parent 2-0",
  //         key: "0-1-0",
  //         icon: <CarryOutOutlined />,
  //         children: [
  //           {
  //             title: "leaf",
  //             key: "0-1-0-0",
  //             icon: <CarryOutOutlined />,
  //           },
  //           {
  //             title: "leaf",
  //             key: "0-1-0-1",
  //             icon: <CarryOutOutlined />,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // ]);

  return (
    <div>
      <>
        <Button type="primary" onClick={showModal}>
          設定列
        </Button>
        <Modal
          title="設定"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div
            style={{
              marginBottom: 16,
            }}
          >
            顯示檔案圖示: <Switch checked={!!showLine} onChange={setShowLine} />
            <br />
            <br />
            顯示完成: <Switch checked={showIcon} onChange={setShowIcon} />
            <br />
            <br />
            切換檔案連接方式:{" "}
            <Select defaultValue="true" onChange={handleLeafIconChange}>
              <Select.Option value="true">收縮</Select.Option>
              <Select.Option value="false">線條</Select.Option>
              <Select.Option value="custom">自訂</Select.Option>
            </Select>
          </div>
        </Modal>
      </>

      {/* 名稱輸入框 */}
      <Input placeholder="Name" value={Name} onChange={handleNodeNameChange} />

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
