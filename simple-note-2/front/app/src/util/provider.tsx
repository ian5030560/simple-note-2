import { useCookies } from "react-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLoaderData, useNavigate, LoaderFunctionArgs, useParams, useNavigation } from "react-router-dom";
import useNodes from "../User/SideBar/NoteTree/store";
import { decodeBase64 } from "./secret";
import { ConfigProvider, Spin, ThemeConfig } from "antd";
import { defaultTheme } from "./theme";

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

    const notesError = new Response(undefined, { status: 410 });

    return await fetch(url, {
        ...requestInit,
        signal: request.signal,
        body: JSON.stringify({ username: username })
    })
        .then(res => {
            if (!res.ok) throw notesError;
            return res.json();
        })
        .catch(() => { throw notesError });
}

export function SettingProvider() {
    const data = useLoaderData() as NoteFetchResult;
    const navigate = useNavigate();
    const { init } = useNodes();
    const { id } = useParams();

    useEffect(() => {
        const sorted = sortNodes(data["one"]);

        init(sorted.map((it) => (
            {
                key: it.noteId, title: it.noteName, children: [],
                parentKey: it.parentId, siblingKey: it.silblingId,
                url: data["multiple"].find(mul => mul.noteId === it.noteId)?.url
            }
        )));
        const _id = id ? id : sorted[0].noteId;

        navigate(_id, { replace: true });
    }, []);

    return <Outlet />;
}

export async function contentLoader({ request, params }: LoaderFunctionArgs<string | null>) {
    const url = APIs.getNote;
    const cookie = getCookie();
    const username = cookie.get("username")!;
    const id = params.id!;

    return await fetch(url, {
        ...requestInit,
        signal: request.signal,
        body: JSON.stringify({ username: username, noteId: id }),
    })
        .then(async res => {
            if (res.ok) return res.status === 204 ? null : await res.text();
            throw new Response(undefined, { status: 404 });
        })
        .catch(() => {
            throw new Response(undefined, { status: 404 })
        });
}

export async function collaborateLoader({ request, params }: LoaderFunctionArgs<boolean>) {
    const joinUrl = APIs.joinCollaborate;
    const numberUrl = APIs.getNumber;
    const cookie = getCookie();
    const username = cookie.get("username")!;
    const { id, host } = params;
    const collabErr = new Response(undefined, { status: 403 });

    return await Promise.all([
        fetch(joinUrl, {
            ...requestInit, signal: request.signal,
            body: JSON.stringify({
                username: username, noteId: id, url: `${id}/${host}`,
                masterName: decodeBase64(host!),
            })
        })
            .then(res => {
                if (!res.ok) throw new Response(undefined, { status: 403 });
            })
            .catch(() => { throw collabErr }),

        fetch(numberUrl, {
            ...requestInit, signal: request.signal,
            body: JSON.stringify({ room: `${id}/${host}` })
        })
            .then(async res => {
                if (!res.ok) throw new Response(undefined, { status: 403 });
                const { count } = await res.json() as { count: number };
                return count === 0;
            })
            .catch(() => { throw collabErr })
    ])
        .then(reses => reses[1])
        .catch(() => { throw collabErr });
}

type ThemeConfigContextType = {
    darken: boolean;
    setDarken: (value: boolean) => void;
    themeFn: (dark: boolean) => ThemeConfig;
    setThemeFn: (fn: ((dark: boolean) => ThemeConfig)) => void;
}
const ThemeConfigContext = createContext<ThemeConfigContextType>({
    themeFn: defaultTheme, darken: false, setDarken: () => { }, setThemeFn: () => {}
});
export function ThemeConfigProvider(props: { children: React.ReactNode }) {
    const [darken, setDarken] = useState(false);
    const [themeFn, setThemeFn] = useState(() => defaultTheme);

    return <ThemeConfigContext.Provider value={{darken, setDarken, themeFn, setThemeFn}}>
        <ConfigProvider theme={themeFn(darken)}>
            {props.children}
        </ConfigProvider>
    </ThemeConfigContext.Provider>;
}

export const useThemeConfig = () => useContext(ThemeConfigContext);