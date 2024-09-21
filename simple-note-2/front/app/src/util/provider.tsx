import { useCookies } from "react-cookie";
import useAPI, { APIs } from "./api"
import React, { createContext, useEffect } from "react";
import { Navigate, Outlet, useLoaderData, useNavigate, LoaderFunctionArgs, useParams } from "react-router-dom";
import useFiles from "../User/SideBar/NoteTree/store";
import { useCollab } from "../Editor/Collaborate/store";

export function PublicProvider() {
    const [{ username }] = useCookies(["username"]);
    return username ? <Navigate to={"note"} replace /> : <Outlet />
}

export function PrivateProvider() {
    const [{ username }] = useCookies(["username"]);
    return !username ? <Navigate to={"/"} replace /> : <Outlet />
}

type NoteTreeData = { noteId: string, noteName: string, parentId: string | null, silblingId: string | null };

function sortNodes(data: NoteTreeData[]) {

    // 分組節點根據 parentId
    const groups = { "root": [] } as { [key: string]: NoteTreeData[] }
    for (const node of data) {
        const parent = node.parentId;
        if (!parent) {
            groups["root"].push(node);
            continue;
        }
        if (!groups[parent]) groups[parent] = []
        groups[parent].push(node);
    }

    // 排序分組內的節點根據 siblingId
    for (const key in groups) {
        const nodes = groups[key];
        const sorted: NoteTreeData[] = [];

        let target: string | null = null;
        let i = 0;
        while (i < nodes.length) {
            const node = nodes[i];
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
    for (const key in groups) {
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

type NoteFetchResult = {
    one: Array<NoteTreeData>,
    multiple: Array<{ noteId: string, noteName: string, url: string }>
}
export async function settingLoader({ request }: LoaderFunctionArgs<any>): Promise<NoteFetchResult | null> {
    
    const url = APIs.loadNoteTree;
    const cookie = getCookie();
    const username = cookie.get("username")!;

    return await fetch(url, {
        ...requestInit,
        signal: request.signal,
        body: JSON.stringify({ username: username })
    })
        .then(res => res.ok ? res.text() : null)
        .then(res => res ? JSON.parse(res) : null)
        .catch(() => null);
}

export function SettingProvider() {
    const data = useLoaderData() as NoteFetchResult | null;
    const navigate = useNavigate();
    const { init } = useFiles();
    
    useEffect(() => {
        if (!data) return;
        const sorted = sortNodes(data["one"]);
        init(sorted.map((it) => (
            {
                key: it.noteId, title: it.noteName, children: [],
                parentKey: it.parentId, siblingKey: it.silblingId,
                url: data["multiple"].find(mul => mul.noteId === it.noteId)?.url
            }
        )));
        const id = sorted[0].noteId;

        if(id) navigate(id, { replace: true });
    }, []);

    return <Outlet />
}

export async function contentLoader({ request, params }: LoaderFunctionArgs<any>): Promise<string | null> {
    const url = APIs.getNote;
    const cookie = getCookie();
    const username = cookie.get("username")!;
    const id = params.id!;
    return await fetch(url, {
        ...requestInit,
        signal: request.signal,
        body: JSON.stringify({ "username": username, noteId: id }),
    })
        .then(res => res.ok ? res.text() : null)
        .catch(() => null)
}
export const Note = createContext<string | undefined>(undefined);

function validate(content: string | null | undefined) {
    if (!content) return false;
    try {
        JSON.parse(content);
        return true;
    }
    catch {
        return false;
    }
}
export function NoteProvider({ children }: { children: React.ReactNode }) {
    const data = useLoaderData() as string | null;

    return <Note.Provider value={validate(data) ? data! : undefined}>
        {children}
    </Note.Provider>
}

export function CollaborateProvider({ children }: { children: React.ReactNode }) {
    const { id, host } = useParams();
    const { active, close, room } = useCollab();
    const getPeople = useAPI(APIs.getPeopleInRoom);
    
    useEffect(() => {
      
        getPeople({room: `${host}/${id}`})[0]
        .then(res => {
            if(res.status === 404){
                console.log(1);
            }
        })
    }, []);

    return children;
}