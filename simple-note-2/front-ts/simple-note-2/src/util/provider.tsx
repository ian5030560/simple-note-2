import { useCookies } from "react-cookie";
import { APIs } from "./api"
import React, { createContext, useEffect } from "react";
import { Navigate, Outlet, useLoaderData, useNavigate, LoaderFunctionArgs, Route, redirect, useNavigation } from "react-router-dom";
import useFiles from "../User/SideBar/FileTree/hook";

export function PublicProvider(){
    const [{username}] = useCookies(["username"]);
    return username ? <Navigate to={"note"} replace/> : <Outlet/>
}

export function PrivateProvider(){
    const [{ username }] = useCookies(["username"]);
    return !username ? <Navigate to={"/"} replace/> : <Outlet/>
}

type NoteTreeData = { noteId: string, noteName: string, parentId: string | null, silblingId: string | null };

function sortNodes(data: NoteTreeData[]) {

    // 分組節點根據 parentId
    let groups = { "root": [] } as { [key: string]: NoteTreeData[] }
    for (let node of data) {
        const parent = node.parentId;
        if (!parent) {
            groups["root"].push(node);
            continue;
        }
        if (!groups[parent]) groups[parent] = []
        groups[parent].push(node);
    }

    // 排序分組內的節點根據 siblingId
    for (let key in groups) {
        let nodes = groups[key];
        const sorted: NoteTreeData[] = [];

        let target: string | null = null;
        let i = 0;
        while (i < nodes.length) {
            let node = nodes[i];
            if (node.silblingId === target) {
                sorted.push(node);
                target = node.noteId;
                i = -1;
            }
            i++;
        }
        groups[key] = sorted;
    }
    // 合併排序後的結果
    let sortedData: NoteTreeData[] = [];
    for (let key in groups) {
        sortedData = sortedData.concat(groups[key]);
    }

    return sortedData;
}

const getCookie = () => new Map(document.cookie.split(":").map((item) => item.split("=")) as [[string, string]]);
const requestInit = {
    method: "POST",
    headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "content-type": "application/json",
    }
}
export async function settingLoader({ request, params }: LoaderFunctionArgs<any>): Promise<NoteTreeData[] | null> {
    if(params.file) redirect("/note");

    let url = APIs.loadNoteTree;
    let cookie = getCookie();
    let username = cookie.get("username")!;
    
    return await fetch(url, {
        ...requestInit,
        signal: request.signal,
        body: JSON.stringify({ "username": username })
    }).then(res => res.json()).then(res => JSON.parse(res)).catch(() => null);
}

export function SettingProvider() {
    const data = useLoaderData() as NoteTreeData[] | null;
    const navigate = useNavigate();
    const [,,,init] = useFiles();
    const navigation = useNavigation();

    useEffect(() => {
        if (!data) return;
        let sorted = sortNodes(data);
        init(sorted.map((it) => ({key: it.noteId, title: it.noteName, children: [], parentKey: it.parentId, siblingKey: it.silblingId})));
        let id = sorted[0].noteId;
        id && navigate(id, { replace: true });
    }, [data, init, navigate]);

    return <Outlet/>
}

export async function contentLoader({ request, params }: LoaderFunctionArgs<any>): Promise<string | null>{
    let url = APIs.getNote;
    let cookie = getCookie();   
    let username = cookie.get("username")!;
    let id = params.file!;
    return await fetch(url, {
        ...requestInit,
        signal: request.signal,
        body: JSON.stringify({ "username": username, noteId: id }),
    }).then(res => res.text()).catch(() => null)
}
export const Note = createContext<string | undefined>(undefined);

function validate(content: string | null | undefined){
    if(!content) return false;
    try{
        JSON.parse(content);
        return true;
    }
    catch(e){
        return false;
    }
}
export function NoteProvider({children}: {children: React.ReactNode}) {
    const data = useLoaderData() as string | null;

    return <Note.Provider value={validate(data) ? data! : undefined}>
        {children}
    </Note.Provider>
}