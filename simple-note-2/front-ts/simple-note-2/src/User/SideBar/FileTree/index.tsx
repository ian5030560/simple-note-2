import React from "react"
import { Tree, theme, TreeDataNode, Button } from "antd";
import Node from "./node";
import useAPI, { APIs } from "../../../util/api";
import { useCookies } from "react-cookie";
import { useFileNodes } from "./node";
import { FaPlus } from "react-icons/fa6";

function findTargetByKey(key: string, origin: TreeDataNode[]) {
    let indice = key.split("-");

    let tmp = origin;
    for (let i of indice.slice(1)) {
        if (!tmp[parseInt(i)].children) break;
        tmp = tmp[parseInt(i)].children!;
    }

    return tmp;
}


function getParentKey(key: string) {
    let indice = key.split("-");

    let result = indice[0]
    for (let i of indice.slice(1, -1)) {
        result = `${result}-${i}`
    }

    return result;
}

function changeSubtreeKey(t: TreeDataNode[], p: string) {

    for (let index in t) {
        let key = `${p}-${index}`;
        t[index].key = key;
        if (t[index].children) {
            changeSubtreeKey(t[index].children!, key);
        }

    }
}
const FileTree = () => {
    const addNote = useAPI(APIs.addNote);
    const [{ username }] = useCookies(["username"]);
    const { token } = theme.useToken();
    const [nodes, setNodes] = useFileNodes();

    const handleAdd = (nodeKey: string, text: string) => {

        setNodes(prev => {
            if (!prev) return prev;

            let arr = prev[0].children!;
            let target = findTargetByKey(nodeKey, arr);

            let key = `${nodeKey}-${target.length}`;
            target.push({
                key: key,
                title: text,
                children: [],
            });

            return [...prev];
        })
    }


    const handleDelete = (nodeKey: string) => {

        setNodes(prev => {
            if (!prev) return prev;
            const arr = prev[0].children!;
            let parent = getParentKey(nodeKey);
            let target = findTargetByKey(parent, arr);
            let i = parseInt(nodeKey.charAt(nodeKey.length - 1));
            target.splice(i, 1);

            changeSubtreeKey(target, parent);

            return [...prev];
        });
    }

    return <>
        <Tree treeData={nodes} rootStyle={{ backgroundColor: token.colorPrimary }} blockNode
            titleRender={(data) => {
                const { title, key } = data as { title: string, key: string };
                return <Node
                    title={title}
                    nodeKey={key}
                    onAdd={(key, text) => handleAdd(key, text)}
                    onDelete={(key) => handleDelete(key)}
                    root={key === "individual" || key === "multiple"}
                />
            }}
            selectable={false}
            defaultExpandAll
        />
        <Button icon={<FaPlus/>} type="text" block/>
    </>
}

export default FileTree;