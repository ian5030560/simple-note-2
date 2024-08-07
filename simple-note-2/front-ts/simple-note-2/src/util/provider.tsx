import { useCookies } from "react-cookie";
import useAPI, { APIs } from "./api"
import React, { createContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams, Outlet } from "react-router-dom";
import { Button, Modal } from "antd";
import useFiles from "../User/SideBar/FileTree/hook";
import { useInfoAction } from "../User/SideBar/info";

export function AuthProivder() {
    const [{ username }] = useCookies(["username"]);
    const [nodes] = useFiles();

    return !username || nodes.length === 0 ? <Navigate to={"/"} /> : <Outlet/>;
}

type NoteTreeData = { noteId: string, noteName: string, parentId: string | null, silblingId: string | null };

function sortNodes(data: NoteTreeData[]) {
    
    // 分組節點根據 parentId
    let groups = {"root": []} as { [key: string]: NoteTreeData[] }
    for(let node of data){
        const parent = node.parentId;
        if(!parent){
            groups["root"].push(node);
            continue;
        }
        if(!groups[parent]) groups[parent] = []
        groups[parent].push(node);
    }

    // 排序分組內的節點根據 siblingId
    for(let key in groups){
        let nodes = groups[key];
        const sorted: NoteTreeData[] = [];

        let target: string | null = null;
        let i = 0;
        while(i < nodes.length){
            let node = nodes[i];
            if(node.silblingId === target){
                sorted.push(node);
                target = node.noteId;
                i = -1;
            }
            i ++;
        }
        groups[key] = sorted;
    }
    // 合併排序後的結果
    let sortedData: NoteTreeData[] = [];
    for(let key in groups){
        sortedData = sortedData.concat(groups[key]);
    }
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
            .then((res: string) => {
                let nodes = sortNodes(JSON.parse(res))

                for (let node of nodes) {
                    add(node.noteId, node.noteName, [], node.parentId, node.silblingId)
                }
                setId(() => nodes[0].noteId);
            })

        return () => {
            info[1].abort();
            tree[1].abort();
        }
    }, [add, getInfo, loadNoteTree, updatePicture, updateThemes, username]);

    return id ? <Navigate to={id} /> : <Outlet />;
}

export const Note = createContext<string | undefined>(undefined);
export function NoteProvider() {
    const getNote = useAPI(APIs.getNote);
    const [{ username }] = useCookies(["username"]);
    const { file } = useParams();
    const [content, setContent] = useState<string>();
    useEffect(() => {
        let note = getNote({ username: username, noteId: file! })
        note[0]
            .then((res) => res.text())
            .then(res => setContent(res))
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

    return <Note.Provider value={content}>
        {content && <Outlet/>}
    </Note.Provider>
}