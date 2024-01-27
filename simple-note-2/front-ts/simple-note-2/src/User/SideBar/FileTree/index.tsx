import React, { SetStateAction, useState } from "react"
import { Tree, theme, TreeDataNode } from "antd";
import { NodeCreater, createIndiviualNode } from "./node";
import { Key, EventDataNode } from "rc-tree/lib/interface";

interface FileDataType extends TreeDataNode{
    key: string,
    title: React.ReactNode,
    children: FileDataType[],
    name: string,
}

function findTargetByKey(key: string, origin: FileDataType[]) {
    let indice = key.split("-");

    let tmp = origin;
    for (let i of indice.slice(1)) {
        tmp = tmp[parseInt(i)].children
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

type SelectInfo = {
    event: "select",
    selected: boolean;
    node: EventDataNode<TreeDataNode>;
    selectedNodes: TreeDataNode[];
    nativeEvent: MouseEvent;
}

interface FileTreeProp {
    individual?: FileDataType[],
    mutiple?: FileDataType[],
    onSelect?: (selectedKeys: Key[], info: SelectInfo) => void;
}

const FileTree: React.FC<FileTreeProp> = (prop) => {

    const { token } = theme.useToken();
    const [i_children, setI_Children] = useState<FileDataType[]>(!prop.individual ? [] :
        prop.individual.map((data): FileDataType => {
            return {
                key: data.key,
                title: createIndiviualNode(
                    data.title,
                    data.key,
                    (k, t) => handleAdd(k, t, setI_Children, createIndiviualNode),
                    (k) => handleDelete(k, setI_Children, createIndiviualNode),
                    false
                ),
                children: data.children,
                name: data.name
            }
        })
    );

    const [m_children, setM_Children] = useState<FileDataType[]>(!prop.mutiple ? [] :
        prop.mutiple.map((data): FileDataType => {
            return {
                key: data.key,
                title: createIndiviualNode(
                    data.title,
                    data.key,
                    (k, t) => handleAdd(k, t, setM_Children, createIndiviualNode),
                    (k) => handleDelete(k, setM_Children, createIndiviualNode),
                    false
                ),
                children: data.children,
                name: data.name
            }
        })
    );

    const handleAdd = (
        nodeKey: string,
        text: string,
        setChildren: React.Dispatch<SetStateAction<FileDataType[]>>,
        createNode: NodeCreater) => {

        setChildren(prev => {
            let target = findTargetByKey(nodeKey, prev);

            let key = `${nodeKey}-${target.length}`;
            target.push({
                key: key,
                title: createNode(
                    text,
                    key,
                    (k, t) => handleAdd(k, t, setChildren, createNode),
                    (k) => handleDelete(k, setChildren, createNode),
                    false
                ),
                children: [],
                name: text
            })

            return [...prev]
        })
    }


    const handleDelete = (
        nodeKey: string, 
        setChildren: React.Dispatch<SetStateAction<FileDataType[]>>, 
        createNode: NodeCreater) => {

        setChildren(prev => {

            let parent = getParentKey(nodeKey);
            let target = findTargetByKey(parent, prev);
            let i = parseInt(nodeKey.charAt(nodeKey.length - 1));
            target.splice(i, 1);

            function changeSubtreeKey(t: FileDataType[], p: string) {

                for (let index in t) {
                    let key = `${p}-${index}`;

                    t[index].key = key;
                    t[index].title = createNode(
                        t[index].name,
                        key,
                        (k, t) => handleAdd(k, t, setChildren, createNode),
                        (k) => handleDelete(k, setChildren, createNode),
                        false
                    )

                    changeSubtreeKey(t[index].children, key);
                }
            }

            changeSubtreeKey(target, parent);

            return [...prev];
        })
    }
    
    const rootData: TreeDataNode[] = [
        {
            key: "individual",
            title: createIndiviualNode(
                "個人筆記",
                "individual",
                (k, t) => handleAdd(k, t, setI_Children, createIndiviualNode),
                (k) => handleDelete(k, setI_Children, createIndiviualNode),
                true
            ),
            children: i_children
        },
        {
            key: "multiple",
            title: createIndiviualNode(
                "多人協作",
                "multiple",
                (k, t) => handleAdd(k, t, setM_Children, createIndiviualNode),
                (k) => handleDelete(k, setM_Children, createIndiviualNode),
                true
            ),
            children: m_children
        }
    ]

    return <Tree
        treeData={rootData}
        rootStyle={{ backgroundColor: token.colorPrimary, }}
        onSelect={prop.onSelect}
    />
}

export default FileTree;