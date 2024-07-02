import { useCookies } from "react-cookie";
import useAPI, { APIs } from "./api"
import React, { createContext, useEffect, useRef, useState } from "react";
import { Navigate, useParams, Outlet } from "react-router-dom";
import { Button, Modal } from "antd";
import useFiles from "../User/SideBar/FileTree/hook";
import { useInfoAction } from "../User/SideBar/info";

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
            .then(() => {

            })

        return () => {
            info[1].abort();
            tree[1].abort();
        }
    }, [getInfo, loadNoteTree, updatePicture, updateThemes, username]);
    
    return id ? <Navigate to={id} /> : <Outlet/>;
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