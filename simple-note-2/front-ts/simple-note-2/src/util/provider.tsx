import { useCookies } from "react-cookie";
import useAPI, { APIs } from "./api"
import React, { createContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams, Outlet } from "react-router-dom";
import { Button, Modal } from "antd";
import useFiles from "../User/SideBar/FileTree/hook";
import { useInfoAction } from "../User/SideBar/info";

type NoteTreeData = { nodeId: string, noteName: string, parentId: string, siblingId: string };
function sortNodes(data: NoteTreeData[]) {
    // 分組節點根據 parentId
    const groupedNodes = data.reduce((acc, node) => {
        const parentId = node.parentId || 'root';
        if (!acc[parentId]) {
            acc[parentId] = [];
        }
        acc[parentId].push(node);
        return acc;
    }, {} as { [key: string]: NoteTreeData[] });

    // 排序分組內的節點根據 siblingId
    Object.keys(groupedNodes).forEach(parentId => {
        const nodes = groupedNodes[parentId];
        const sortedNodes = [];
        const nodeMap: { [key: string]: NoteTreeData } = {};

        nodes.forEach(node => {
            nodeMap[node.nodeId] = node;
        });

        let currentNode = nodes.find(node => !node.siblingId);
        while (currentNode) {
            sortedNodes.push(currentNode);
            currentNode = nodes.find(node => node.siblingId === currentNode?.nodeId);
        }

        groupedNodes[parentId] = sortedNodes;
    });

    // 合併排序後的結果
    let sortedData: NoteTreeData[] = [];
    Object.keys(groupedNodes).forEach(parentId => {
        sortedData = sortedData.concat(groupedNodes[parentId]);
    });

    return sortedData;
}


export function SettingProvider() {
    const loadNoteTree = useAPI(APIs.loadNoteTree);
    const getInfo = useAPI(APIs.getInfo);
    const [{ username }] = useCookies(["username"]);
    const [id, setId] = useState<string>();
    const [, add,] = useFiles();
    const { updatePicture, updateThemes, updateThemeUsage } = useInfoAction();

    useEffect(() => {
        if (!username) return;

        let info = getInfo({ username: username })
        info[0].then((res) => res.json())
            .then((res) => {
                updatePicture(res.profile_photo);
                updateThemes(res.themes);
            })
            .catch(() => { });

        let tree = loadNoteTree({ username })
        tree[0].then((res) => res.json())
            .then((raw: string) => {
                let res = (JSON.parse(raw) as [string, string, string, string][])
                    .map((item) => ({nodeId: item[0], noteName: item[1], parentId: item[2], siblingId: item[3]} as NoteTreeData))
                let nodes = sortNodes(res)
                console.log(nodes)
                for (let node of nodes) {
                    add(node.nodeId, node.noteName, [], node.parentId, node.siblingId)
                }
            })

        return () => {
            info[1].abort();
            tree[1].abort();
        }
    }, [add, getInfo, loadNoteTree, updatePicture, updateThemes, username]);

    return id ? <Navigate to={id} /> : <Outlet />;
}

export const Note = createContext<string | undefined>(undefined);
export function NoteProvider({ children }: { children: React.ReactNode }) {
    const getNote = useAPI(APIs.getNote);
    const [{ username }] = useCookies(["username"]);
    const { file } = useParams();
    const cRef = useRef<string>();

    useEffect(() => {
        let note = getNote({ username: username, noteId: file! })
        note[0]
            .then((res) => JSON.stringify(res.json()))
            .then(res => cRef.current = res)
            .catch(() => {
                Modal.error({
                    title: "載入發生錯誤",
                    content: "請重新整理頁面",
                    footer: <div style={{ direction: "rtl" }}>
                        <Button type="primary" danger
                            onClick={() => window.location.reload()}>重新整理</Button>
                    </div>,
                    closeIcon: null
                })
            })

        return () => note[1].abort();

    }, [file, getNote, username]);

    return <Note.Provider value={cRef.current}>
        {children}
    </Note.Provider>
}